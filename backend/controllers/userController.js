const User = require("../models/User");
const Club = require("../models/Club");

// @desc    Get current user's dashboard
// @route   GET /api/users/dashboard
const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("clubId", "name description logoUrl");
      
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update profile
// @route   PUT /api/users/update
const updateUserProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      profilePic: req.body.profilePic,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get a user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("clubId", "name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getUserDashboard,
  updateUserProfile,
  getUserById,
  getAllUsers,
  deleteUser,
};
