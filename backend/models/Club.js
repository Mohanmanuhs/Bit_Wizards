const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logoUrl: String,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: { type: Date, default: Date.now },
  isAproved: { type: Boolean, default: false },
});

clubSchema.pre("findOneAndDelete", async function (next) {
  try {
    const clubId = this.getQuery()._id;
    this._deletedClubId = clubId; // Pass to post middleware
    next();
  } catch (err) {
    next(err);
  }
});

clubSchema.post("findOneAndDelete", async function () {
  const clubId = this._deletedClubId;
  if (!clubId) return;

  const Event = require("./Event");
  const Engagement = require("./Engagement");
  const User = require("./User");

  // Delete related events
  await Event.deleteMany({ createdBy: clubId });

  // Delete related engagements
  await Engagement.deleteMany({ clubId });

  // Remove club from all users' followingClubs
  await User.updateMany(
    { followingClubs: clubId },
    { $pull: { followingClubs: clubId } }
  );

  console.log(`All events, engagements, and followers cleaned for club: ${clubId}`);
});

module.exports = mongoose.model("Club", clubSchema);
