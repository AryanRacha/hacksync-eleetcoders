import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateTokens.js";
import nodemail from "nodemailer";

// Signup user
export async function signupUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Validation checks
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters",
      });
    }

    if (role !== "user" && role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role ID" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    // Generating token and setting cookie
    const token = generateTokenAndSetCookie(newUser._id, newUser.role, res);

    // Saving the new user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account has been successfully created",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Login user
export async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    // Validation checks
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (role !== "user" && role !== "admin") {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Find user by email
    const user = await User.findOne({
      email: email,
      role: role,
    }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password match
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generating token and setting cookie
    const token = generateTokenAndSetCookie(user._id, user.role, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Logout user
export async function logoutUser(req, res) {
  try {
    // Clearing the authentication cookie
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;

    await user.save();
  } catch (error) {
    console.log("Error in changePassword:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.pendingNewPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send OTP via email
    const transporter = nodemail.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Password Change",
      html: `<p>Hello ${user.name},</p><p>Your OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log("Error in requestPasswordChange:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verifyOtpAndUpdatePassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetOtp ||
      !user.resetOtpExpires ||
      !user.pendingNewPassword
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP request found" });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    if (user.resetOtp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Update password
    user.password = user.pendingNewPassword;

    // Clear OTP and pending password
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.pendingNewPassword = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in verifyOtpAndUpdatePassword:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
