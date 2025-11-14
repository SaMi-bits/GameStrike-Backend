const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  rating: Number,
  text: String,
  difficulty: Number,
  progress: Number,
  createdAt: Date
});

module.exports = mongoose.model('Review', reviewSchema);
