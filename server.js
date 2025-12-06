const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS PARA PRODUCCIÓN (GitHub Pages + Render)
const cors = require("cors");

app.use(cors({
  origin: [
    "https://sami-bits.github.io",  // tu frontend en GitHub Pages
    "http://localhost:5173",        // para desarrollo local
    "http://localhost:3000"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


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
