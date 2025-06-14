const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  logoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Club", clubSchema);
