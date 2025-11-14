const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// Obtener todos los juegos
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    res.status(500).json({ message: "Error al obtener juegos", error: error.message });
  }
});

// Obtener un juego por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que sea un ObjectId válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error al obtener juego:", error);
    res.status(500).json({ message: "Error al obtener juego", error: error.message });
  }
});

// Agregar un nuevo juego
router.post("/", async (req, res) => {
  try {
    const { name, genre, platform, releaseYear, imageUrl, rating, description } = req.body;
    
    // Validación básica
    if (!name || !genre || !platform || !releaseYear) {
      return res.status(400).json({ 
        message: "Campos requeridos faltantes",
        required: ["name", "genre", "platform", "releaseYear"]
      });
    }

    const newGame = new Game({ 
      name, 
      genre, 
      platform, 
      releaseYear,
      imageUrl: imageUrl || "",
      rating: rating || 0,
      description: description || ""
    });
    
    await newGame.save();

    res.status(201).json({
      message: "Juego agregado correctamente ✅",
      data: newGame
    });
  } catch (error) {
    console.error("Error al agregar juego:", error);
    res.status(500).json({ message: "Error al agregar juego", error: error.message });
  }
});

// Actualizar un juego por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que sea un ObjectId válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updatedData = req.body;
    
    // 🔥 FIX: Asegurar que rating se guarda
    if (updatedData.rating !== undefined) {
      updatedData.rating = Number(updatedData.rating);
    }

    const updatedGame = await Game.findByIdAndUpdate(
      id, 
      updatedData, 
      { 
        new: true,
        runValidators: true // Ejecuta validaciones del schema
      }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    res.json({
      message: "Juego actualizado correctamente ✅",
      data: updatedGame
    });
  } catch (error) {
    console.error("Error al actualizar juego:", error);
    res.status(500).json({ message: "Error al actualizar juego", error: error.message });
  }
});

// Eliminar un juego por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que sea un ObjectId válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    // 🔥 BONUS: También eliminar las reseñas asociadas
    const Review = require("../models/Review");
    await Review.deleteMany({ gameId: id });

    res.json({
      message: "Juego eliminado correctamente 🗑️",
      data: deletedGame
    });
  } catch (error) {
    console.error("Error al eliminar juego:", error);
    res.status(500).json({ message: "Error al eliminar juego", error: error.message });
  }
});

module.exports = router;