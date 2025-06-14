const Club = require("../models/Club");

// @desc    Create a new club
// @route   POST /api/clubs
exports.createClub = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;

    const existing = await Club.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Club already exists" });
    }

    const club = await Club.create({ name, description, logoUrl });
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
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
