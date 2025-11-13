const express = require("express");
const router = express.Router();
const Game = require("../models/Game"); // Importamos el modelo

// Obtener todos los juegos
router.get("/", async (req, res) => {
  try {
    const games = await Game.find(); // busca todos en la BD
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener juegos", error });
  }
});

// Agregar un nuevo juego
router.post("/", async (req, res) => {
  try {
    const { name, genre, platform, releaseYear } = req.body;
    const newGame = new Game({ name, genre, platform, releaseYear });
    await newGame.save(); // guardar en MongoDB

    res.status(201).json({
      message: "Juego agregado correctamente ✅",
      data: newGame
    });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar juego", error });
  }
});
// Actualizar un juego por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedGame = await Game.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedGame) {
      return res.status(404).json({ message: "Juego no encontrado ❌" });
    }

    res.json({
      message: "Juego actualizado correctamente ✅",
      data: updatedGame
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar juego", error });
  }
});

// Eliminar un juego por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Juego no encontrado ❌" });
    }

    res.json({
      message: "Juego eliminado correctamente 🗑️",
      data: deletedGame
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar juego", error });
  }
});
// ✅ Obtener un juego por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado ❌" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error al obtener juego:", error);
    res.status(500).json({ message: "Error al obtener juego ❌", error });
  }
});



module.exports = router;
