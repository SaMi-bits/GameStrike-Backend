const mongoose = require("mongoose");

// Definimos el esquema (estructura del documento)
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // obligatorio
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
    required: true },
    imageUrl: { type: String, default: "" }, // 🆕 Imagen del juego
});

// Creamos el modelo basado en ese esquema
const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
