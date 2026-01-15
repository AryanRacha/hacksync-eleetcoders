import User from "../models/user.model.js";
import Issue from "../models/issue.model.js";
import { findIssuesNearUser } from "../utils/location.js";
// GET /api/user/profile
export async function getMyProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /api/user/profile
export async function updateMyProfile(req, res) {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// DELETE /api/user/profile
export async function deleteMyAccount(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /api/user/my-issues
export async function getMyReportedIssues(req, res) {
  try {
    const user = await User.findById(req.user._id).select("reportedIssues");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch the actual issues from the Issue model
    const reports = await Issue.find({ _id: { $in: user.reportedIssues } });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /api/user/followed-issues
export async function getFollowedIssues(req, res) {
  try {
    const user = await User.findById(req.user._id).select("followedIssues");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch the actual issues from the Issue model
    const issues = await Issue.find({ _id: { $in: user.followedIssues } });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getNearbyLocations(req, res) {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({
      message:
        "Unable to get Users current location pls ensure that your location is on",
    });
  }

  const issues = await findIssuesNearUser(Number(latitude), Number(longitude));
  res.status(200).json(issues);
}
