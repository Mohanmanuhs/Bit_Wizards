const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'club_admin', 'super_admin'], default: 'student' },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  followingClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
