import Department from "../models/dept.model.js";

// Create a new department
export const createDepartment = async (req, res) => {
  try {
		const { name, zone, categoriesHandled } = req.body;
		const adminId = req.user.id; // Assuming req.user is set by auth middleware
		const newDepartment = new Department({
			name,
			zone,
			categoriesHandled,
			adminId
		});
		await newDepartment.save();
		res.status(201).json(newDepartment);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get all departments
export const getAllDepartments = async (req, res) => {
	try {
		const departments = await Department.find().populate("adminId", "_id name email");
		res.status(200).json(departments);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get all users by categories handled by a department
export const getAllUsersByCategoriesHandledByDepartment = async (req, res) => {
	try {
		const { departmentId } = req.params;
		const department = await Department.findById(departmentId);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		const categories = department.categoriesHandled;
		const users = await User.find({ category: { $in: categories } });
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get all users by zone of a department
export const getAllUsersByZoneByDepartment = async (req, res) => {
	try {
		const { departmentId } = req.params;
		const department = await Department.findById(departmentId);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		const zone = department.zone;
		const users = await User.find({ zone: zone });
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
