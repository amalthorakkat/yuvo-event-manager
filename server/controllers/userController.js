const User = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    console.error("Error in getUsers", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.role = role || user.role;
    await user.save();
    console.log("User updated successfully");
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }
    await user.deleteOne();
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
