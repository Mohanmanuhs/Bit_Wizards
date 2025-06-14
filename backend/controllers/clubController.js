const Club = require("../models/Club");
const User = require("../models/User")

// @desc    Create a new club
// @route   POST /api/clubs
exports.createClub = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;
    const userId = req.user.id; // From protect middleware

    const existing = await Club.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Club already exists" });
    }

    const club = await Club.create({
      name,
      description,
      logoUrl,
      userId: userId // ← this field should exist in your Club model
    });

    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Follow a club
// @route   POST /api/users/follow/:clubId
exports.followClub = async (req, res) => {
  try {
    const userId = req.user.id; // From decoded JWT in middleware
    const clubId = req.params.clubId;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

  

    // Add to following list
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { followingClubs: clubId } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Unfollow a club
// @route   POST /api/users/unfollow/:clubId
exports.unfollowClub = async (req, res) => {
  try {
    const userId = req.user.id; // from decoded JWT in authenticateUser middleware
    const clubId = req.params.clubId;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Remove the club from user's followingClubs
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { followingClubs: clubId } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Club unfollowed", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('userId', 'name');
    console.log(clubs)
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Get a single club by ID
// @route   GET /api/clubs/:id
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
