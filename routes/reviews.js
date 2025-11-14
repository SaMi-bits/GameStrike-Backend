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

// ✅ Crear nueva reseña (envía gameId en el body)
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: 'Reseña agregada correctamente ✅', data: newReview });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la reseña ❌', error });
  }
});

// 🔥 POST /reviews/:gameId → Crear reseña para un juego (gameId en params)
router.post('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { rating, text, difficulty, progress } = req.body;

    const newReview = await Review.create({
      gameId,
      rating,
      text,
      difficulty,
      progress,
      createdAt: new Date()
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la reseña" });
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

// 🔥 GET /reviews/game/:gameId → obtener reseñas de un juego
router.get('/game/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId }).sort({ createdAt: -1 }).populate('gameId', 'name');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando reseñas" });
  }
});

module.exports = router;
