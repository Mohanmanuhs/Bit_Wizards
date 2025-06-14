const User = require("../models/User");
const Club = require("../models/Club");
const jwt = require("jsonwebtoken");


// @desc    Get current user's dashboard
// @route   GET /api/users/dashboard
const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.body.id)
      .select("-password")
      .populate("clubId", "name description logoUrl");
      
    if (!user) return res.status(404).json({ message: "User not found!" });

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

    const updatedUser = await User.findByIdAndUpdate(req.body.id, updates, {
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
    if (req.body.role !== "super_admin") {
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
    // 1. Extract token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user using ID from token
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 4. Delete user by ID (provided in route param)
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
