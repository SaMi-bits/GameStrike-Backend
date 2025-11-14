const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Game", 
    required: true 
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  text: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // 🔥 NUEVO: Campos que faltan del frontend
  author: {
    type: String,
    required: true,
    default: "Anónimo"
  },
  avatar: {
    type: String,
    default: "🎮"
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);