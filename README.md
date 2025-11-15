# 🎮 GameStrike Backend API

API REST para la gestión de videojuegos y reseñas.

## 🚀 Tecnologías

- **Node.js** v16+
- **Express** v5
- **MongoDB** con Mongoose
- **CORS** habilitado

## 📦 Instalación
```bash
npm install
```

## ⚙️ Configuración

Crea un archivo `.env`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/gamestrike
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🏃 Ejecución
```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start
```

## 📚 Endpoints

### Juegos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/games` | Obtener todos los juegos |
| GET | `/api/games/:id` | Obtener un juego por ID |
| POST | `/api/games` | Crear nuevo juego |
| PUT | `/api/games/:id` | Actualizar juego |
| DELETE | `/api/games/:id` | Eliminar juego |

### Reseñas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reviews` | Obtener todas las reseñas |
| GET | `/api/reviews/game/:gameId` | Reseñas de un juego |
| POST | `/api/reviews/:gameId` | Crear reseña |
| DELETE | `/api/reviews/:id` | Eliminar reseña |

## 📝 Ejemplos de uso

### Crear un juego
```bash
curl -X POST http://localhost:4000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zelda: Breath of the Wild",
    "genre": "Aventura",
    "platform": "Nintendo Switch",
    "releaseYear": 2017,
    "imageUrl": "zelda.jpg"
  }'
```

### Crear una reseña
```bash
curl -X POST http://localhost:4000/api/reviews/GAME_ID \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Juan",
    "avatar": "🎮",
    "rating": 5,
    "text": "¡Increíble juego!",
    "difficulty": 7,
    "progress": 85
  }'
```

## 🔧 Estructura del proyecto
```
backend/
├── config/
│   └── database.js
├── middleware/
│   └── validation.js
├── models/
│   ├── Game.js
│   └── Review.js
├── routes/
│   ├── games.js
│   └── reviews.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 🐛 Manejo de errores

La API retorna códigos de estado HTTP estándar:

- `200` - Éxito
- `201` - Recurso creado
- `400` - Error en los datos enviados
- `404` - Recurso no encontrado
- `500` - Error del servidor

## 📄 Licencia

MIT