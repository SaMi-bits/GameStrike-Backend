const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// ✅ Obtener todas las reseñas
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('gameId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reseñas ❌' });
  }
});

// ✅ Crear nueva reseña
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: 'Reseña agregada correctamente ✅', data: newReview });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la reseña ❌', error });
  }
});

// ✅ Actualizar reseña
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Reseña actualizada correctamente ✅', data: updatedReview });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la reseña ❌', error });
  }
});

// ✅ Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reseña eliminada correctamente ✅' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la reseña ❌', error });
  }
  
});
// ✅ Obtener todas las reseñas de un juego específico (si no hay, devuelve array vacío)
router.get("/game/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ gameId: id }).populate("gameId", "name");
    res.json(reviews); // incluso si está vacío []
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas del juego ❌", error });
  }
});


module.exports = router;
