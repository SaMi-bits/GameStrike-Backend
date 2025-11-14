const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true
  },
  imageUrl: { 
    type: String, 
    default: "" 
  },
  // 🔥 NUEVO: Campo rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // 🔥 NUEVO: Campo description
  description: {
    type: String,
    default: ""
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;