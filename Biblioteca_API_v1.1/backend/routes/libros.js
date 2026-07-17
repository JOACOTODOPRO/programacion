// routes/libros.js
// Rutas (parte del Controlador en MVC de una API): define los endpoints
// y los conecta con la función correspondiente del controlador.

const express = require('express');
const router = express.Router();

const {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
} = require('../controllers/libroController');

router.get('/', obtenerLibros);          // GET    /libros
router.get('/:id', obtenerLibroPorId);   // GET    /libros/:id
router.post('/', crearLibro);            // POST   /libros
router.put('/:id', actualizarLibro);     // PUT    /libros/:id
router.delete('/:id', eliminarLibro);    // DELETE /libros/:id

module.exports = router;
