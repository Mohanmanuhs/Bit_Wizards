const Engagement = require("../models/Engagement");

// @desc    Create or update like/dislike/comment
// @route   POST /api/engagements
exports.createEngagement = async (req, res) => {
  try {
    const { eventId, type, commentText, clubId } = req.body;
    console.log(req.body)
    console.log(req.user)
    const userId = req.user.id;

    if (!["like", "dislike", "comment"].includes(type)) {
      return res.status(400).json({ message: "Invalid engagement type" });
    }

    if (type === "comment" && !commentText) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (type === "like" || type === "dislike") {
      // Delete opposite reaction if exists
      await Engagement.findOneAndDelete({ eventId, userId, type: type === "like" ? "dislike" : "like" });
    }

    const newEngagement = await Engagement.findOneAndUpdate(
      { eventId, userId, type },
      { commentText, clubId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(newEngagement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all engagements for an event
// @route   GET /api/engagements/event/:eventId
exports.getEventEngagements = async (req, res) => {
  try {
    const engagements = await Engagement.find({ eventId: req.params.eventId }).populate("userId", "name profilePic");
    res.status(200).json(engagements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get average likes per club (analytics)
// @route   GET /api/engagements/club-likes
exports.getAverageLikesPerClub = async (req, res) => {
  try {
    const result = await Engagement.aggregate([
      { $match: { type: "like" } },
      { $group: { _id: "$clubId", likeCount: { $sum: 1 } } }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
