const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS - Usar CLIENT_URL del .env
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin
    if (!origin) return callback(null, true);
    
    // Permitir subdomios de vercel
    if (origin.match(/^https:\/\/game-strike-frontend.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
// ✅ Fin CORS
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
