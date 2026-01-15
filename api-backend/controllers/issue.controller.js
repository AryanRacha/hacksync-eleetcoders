import Issue from "../models/issue.model.js";
import Report from "../models/report.model.js";
import Department from "../models/dept.model.js";
import User from "../models/user.model.js";
import { uploadImagesToAppwrite } from "../utils/imageUploader.js";
import { reverseGeocode } from "../utils/location.js";

export const createIssue = async (req, res) => {
  try {
    // --- 1. GET & VALIDATE DATA ---
    const { title, category, description, latitude, longitude } = req.body;
    const imageFiles = req.files; // This should be an array when using upload.array("images")
    const userId = req.user._id;

    if (!title || !category || !description || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Images are optional, but if provided, they should be valid
    if (imageFiles && imageFiles.length > 0) {
      // Validate that files have the required properties
      const validFiles = imageFiles.filter(
        (file) => file.buffer && file.mimetype
      );
      if (validFiles.length === 0) {
        return res.status(400).json({ error: "Invalid image files provided." });
      }
    }

    // --- 2. UPLOAD IMAGES & REVERSE GEOCODE ---
    const [imageUrls, address] = await Promise.all([
      uploadImagesToAppwrite(imageFiles || []), // <-- Handle case when no images
      reverseGeocode(latitude, longitude),
    ]);

    const defaultImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

    // --- 3. CHECK FOR DUPLICATES ---
    const DUPLICATE_SEARCH_RADIUS_METERS = 50;
    const existingIssue = await Issue.findOne({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: DUPLICATE_SEARCH_RADIUS_METERS,
        },
      },
      category: category,
      status: { $ne: "Resolved" },
    });

    // --- 4. EXECUTE FINAL LOGIC ---

    // --- PATH A: DUPLICATE ISSUE FOUND ---
    if (existingIssue) {
      // Create a new report document
      const newReport = new Report({
        issue_id: existingIssue._id,
        user_id: userId,
        // For a duplicate, we can save all new images or just the first. Let's save all.
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
        description: description,
      });
      await newReport.save();

      // Add the new report's ID to the existing issue's report list
      existingIssue.report_id.push(newReport._id);
      await existingIssue.save();

      return res.status(200).json({
        message: "Report added to existing issue.",
        issue: existingIssue,
      });
    }

    // --- PATH B: NO DUPLICATE FOUND (CREATE NEW ISSUE) ---
    else {
      // Create the new master issue document
      const newIssue = new Issue({
        title: title,
        category: category,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        address: address,
        firstReportedBy: userId,
        defaultImageUrl: defaultImageUrl,
        defaultDescription: description,
        // report_id and follow_id will be populated next
      });

      // Create the first report document for this new issue
      const firstReport = new Report({
        issue_id: newIssue._id,
        user_id: userId,
        imageUrl: defaultImageUrl,
        description: description,
      });
      await firstReport.save();

      // Add the first report's ID to the new issue
      newIssue.report_id.push(firstReport._id);

      // Placeholder for Automated Department Routing
      const department = await Department.findOne({
        categoriesHandled: category,
      });
      if (department) {
        newIssue.assignedTo = department._id;
      }

      await newIssue.save();

      return res.status(201).json({
        message: "New issue created successfully.",
        issue: newIssue,
      });
    }
  } catch (error) {
    console.error("Error in createIssue controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    // Find all issues and sort them by creation date (newest first)
    const issues = await Issue.find({})
      .populate("firstReportedBy", "name email")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error in getAllIssues controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate("reports");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addReportToIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if user already reported this issue
    const alreadyReported = issue.reports.some(
      (r) => r.user?.toString() === userId.toString()
    );
    if (alreadyReported) {
      return res
        .status(400)
        .json({ message: "User has already reported this issue" });
    }

    if (issue.reports.length === 0) {
      // First report: store description and imageUrl
      const { description, imageUrl } = req.body;
      const report = new Report({
        description,
        imageUrl,
        reportedBy: userId,
        issue: id,
      });
      await report.save();
      issue.reports.push({ user: userId, issue: id });
      await issue.save();
      return res
        .status(201)
        .json({ message: "First report added to issue", report });
    } else {
      // Only add userId and issueId for subsequent reports
      // Prevent duplicate reports from same user
      const alreadyReported = issue.reports.some(
        (r) => r.user?.toString() === userId.toString()
      );
      if (alreadyReported) {
        return res
          .status(400)
          .json({ message: "User has already reported this issue" });
      }
      issue.reports.push({ user: userId, issue: id });
      await issue.save();
      return res
        .status(201)
        .json({ message: "Report reference added to issue" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const followIssue = async (req, res) => {
  try {
    const userId = req.user._id; // assuming user is authenticated and user object is in req
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({ message: "Issue ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent duplicate follows
    if (user.followedIssues.includes(issueId)) {
      return res.status(400).json({ message: "Already following this issue." });
    }

    user.followedIssues.push(issueId);
    await user.save();

    res.status(200).json({
      message: "Issue followed successfully.",
      followedIssues: user.followedIssues,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const unfollowIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    issue.follows = issue.follows.filter(
      (followerId) => followerId.toString() !== userId.toString()
    );
    await issue.save();
    res.status(200).json({ message: "Issue unfollowed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Submitted", "In Progress", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    issue.status = status;
    await issue.save();
    res.status(200).json({ message: "Issue status updated", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const assignIssueToDept = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    issue.assignedTo = departmentId;
    await issue.save();
    res.status(200).json({ message: "Issue assigned to department", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    await Issue.findByIdAndDelete(id);
    res.status(200).json({ message: "Issue deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
