// servidor principal de Backend - version confiable.
// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
// Importar rutas
const gamesRoutes = require("./routes/games");

// Usar rutas
app.use("/api/games", gamesRoutes)
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API GameTracker funcionando 🚀' });
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/gametracker';

// Conexión a MongoDB y arranque del servidor
mongoose.connect(MONGO)
  .then(() => {
    console.log('MongoDB conectado ✅');
    app.get("/", (req, res) => {
      
  res.send("API funcionando ✅");
});

    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Error conectando a MongoDB ❌', err);
  });
