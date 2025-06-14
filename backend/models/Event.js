const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ["announcement", "event", "podcast", "video"],
    required: true,
  },
  tags: [{
    type: String,
    enum: [
      "technical", "cultural", "sports", "social", "educational",
      "music", "talk", "competition", "workshop", "seminar", "general"
    ],
  }],
  mediaUrl: String, // for video, podcast, etc.
  eventDate: Date, // optional
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date
});

module.exports = mongoose.model("Event", eventSchema);
