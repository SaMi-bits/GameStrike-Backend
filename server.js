const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS ACTUALIZADO - VERSIÓN FINAL
app.use(cors({
  origin: [
    "https://game-strike-frontend.vercel.app",           // Vercel producción
    "https://game-strike-frontend-*.vercel.app",         // Vercel previews
    "https://sami-bits.github.io",                        // GitHub Pages (si lo usas)
    "https://gamestrike-api.onrender.com",               // Backend
    "http://localhost:5173",                              // Desarrollo local
    "http://localhost:3000"
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Importar y usar rutas
const gamesRoutes = require("./routes/games");
const reviewRoutes = require('./routes/reviews');

app.use("/api/games", gamesRoutes);
app.use("/api/reviews", reviewRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API GameStrike funcionando 🚀',
    endpoints: {
      games: '/api/games',
      reviews: '/api/reviews'
    }
  });
});

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/gamestrike';

// Conexión a MongoDB y servidor
mongoose
  .connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${MONGO}`);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Apagado seguro
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ MongoDB desconectado');
  process.exit(0);
});
