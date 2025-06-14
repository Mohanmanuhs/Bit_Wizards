const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "dislike", "comment"],
    required: true,
  },
  commentText: {
    type: String,
    required: function () {
      return this.type === "comment";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

engagementSchema.index({ eventId: 1, userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Engagement", engagementSchema);
