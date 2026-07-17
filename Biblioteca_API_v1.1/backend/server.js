// server.js
// Punto de entrada del backend. Configura Express, middlewares globales,
// la conexión a MongoDB y el montaje de las rutas.

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const conectarDB = require('./config/database');
const librosRoutes = require('./routes/libros');
const { errorHandler, rutaNoEncontrada } = require('./middleware/errorHandler');

const app = express();

// Conexión a la base de datos
conectarDB();

// Middlewares globales
app.use(cors()); // permite que el frontend (abierto como archivo o en otro puerto) consuma la API
app.use(express.json()); // parsea el body de las requests como JSON
app.use(express.urlencoded({ extended: true }));

// Ruta de salud/bienvenida
app.get('/', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'API de Biblioteca Digital v1.1 funcionando correctamente 📚',
    endpoints: {
      listarLibros: 'GET /libros',
      obtenerLibro: 'GET /libros/:id',
      crearLibro: 'POST /libros',
      actualizarLibro: 'PUT /libros/:id',
      eliminarLibro: 'DELETE /libros/:id',
    },
  });
});

// Montaje de rutas de la API
app.use('/libros', librosRoutes);

// Manejo de rutas inexistentes y errores (siempre al final)
app.use(rutaNoEncontrada);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
