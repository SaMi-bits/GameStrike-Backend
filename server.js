const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS ABIERTO (temporal, para debug)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas
const gamesRoutes = require("./routes/games");
const reviewRoutes = require('./routes/reviews');

app.use("/api/games", gamesRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'API GameStrike funcionando 🚀'
  });
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Mongo error:', err);
    process.exit(1);
  });
