const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('gameId', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: 'Error al obtener las reseñas', error: error.message });
  }
});

// Obtener reseñas de un juego específico
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Validar que sea un ObjectId válido ok 
    if (!gameId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const reviews = await Review.find({ gameId })
      .sort({ createdAt: -1 })
      .populate('gameId', 'name');
    
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas del juego:", error);
    res.status(500).json({ message: "Error cargando reseñas", error: error.message });
  }
});

// Crear nueva reseña (gameId en params)
router.post('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { rating, text, difficulty, progress, author, avatar } = req.body;

    // Validaciones
    if (!gameId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de juego inválido" });
    }

    if (!text || rating === undefined) {
      return res.status(400).json({ 
        message: "Campos requeridos faltantes",
        required: ["text", "rating"]
      });
    }

    const newReview = await Review.create({
      gameId,
      rating: Number(rating),
      text,
      difficulty: Number(difficulty) || 1,
      progress: Number(progress) || 0,
      author: author || "Anónimo",
      avatar: avatar || "🎮",
      date: new Date()
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate('gameId', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ message: "No se pudo crear la reseña", error: error.message });
  }
});

// Actualizar reseña
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true,
        runValidators: true
      }
    ).populate('gameId', 'name');

    if (!updatedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.json({ 
      message: 'Reseña actualizada correctamente ✅', 
      data: updatedReview 
    });
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    res.status(400).json({ message: 'Error al actualizar la reseña', error: error.message });
  }
});

// Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    res.json({ message: 'Reseña eliminada correctamente ✅' });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(400).json({ message: 'Error al eliminar la reseña', error: error.message });
  }
});

module.exports = router;