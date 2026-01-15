import Report from "../models/report.model.js";
import Issue from "../models/issue.model.js";

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}).populate("user_id");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all reports submitted by the user
    const userReports = await Report.find({ user_id: userId }).select(
      "issue_id"
    );
    const issueIdsFromReports = userReports.map((report) => report.issue_id);

    // Find all issues where the user was the first reporter or contributed a report
    const issues = await Issue.find({
      $or: [{ user_id: userId }, { _id: { $in: issueIdsFromReports } }],
    }).sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    console.error("Error in getMyReportedIssues controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("user_id");
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    console.log("Deleted report:", report);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
