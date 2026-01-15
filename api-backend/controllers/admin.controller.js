
import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";
import Department from "../models/dept.model.js";

export const getDashboardStats = async (req, res) => {
	try {
		const totalReports = await Issue.countDocuments();
		const highRisk = await Issue.countDocuments({ "auditVerification.riskLevel": { $in: ["High", "Critical"] } });
		const resolved = await Issue.countDocuments({ status: "Resolved" });
		const pendingAudits = await Issue.countDocuments({ "auditVerification.status": "Pending" });

		// Calculate resolution rate
		const resolutionRate = totalReports > 0 ? ((resolved / totalReports) * 100).toFixed(1) : 0;

		// Get recent 5 issues for the live feed
		const recentIssues = await Issue.find({})
			.sort({ createdAt: -1 })
			.limit(5)
			.select("title category status createdAt");

		res.status(200).json({
			totalReports,
			highRisk,
			resolutionRate,
			pendingAudits,
			recentIssues
		});
	} catch (error) {
		console.error("Error in getDashboardStats:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createDepartment = async (req, res) => {
	try {
		const { name, categoriesHandled, location, contactEmail } = req.body;
		const existingDept = await Department.findOne({ name });
		if (existingDept) {
			return res.status(400).json({ message: "Department already exists" });
		}
		const newDept = new Department({
			name,
			categoriesHandled,
			location,
			contactEmail,
		});
		await newDept.save();
		res.status(201).json(newDept);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllDepartments = async (req, res) => {
	try {
		const departments = await Department.find({});
		res.status(200).json(departments);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllUsersByCategoriesHandledByDepartment = async (req, res) => {
	// Placeholder implementation as requested by existing structure
	res.status(200).json({ message: "Not implemented yet" });
};

export const getAllUsersByZoneByDepartment = async (req, res) => {
	// Placeholder implementation as requested by existing structure
	res.status(200).json({ message: "Not implemented yet" });
};
