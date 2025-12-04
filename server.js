const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());

// Configuración CORS para producción
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging middleware (opcional pero útil)
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

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/gamestrike';

// Conexión a MongoDB y arranque del servidor
mongoose.connect(MONGO)
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

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ MongoDB desconectado');
  process.exit(0);
});