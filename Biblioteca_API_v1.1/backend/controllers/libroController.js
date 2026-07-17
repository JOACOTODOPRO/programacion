// controllers/libroController.js
// Controlador (C de MVC): contiene la lógica de negocio para cada endpoint.
// Se apoya en el modelo Libro para hablar con MongoDB y responde en JSON.
// Todos los errores se delegan al middleware de manejo de errores con next(error).

const Libro = require('../models/Libro');

// GET /libros -> Obtener todos los libros
const obtenerLibros = async (req, res, next) => {
  try {
    const libros = await Libro.find().sort({ createdAt: -1 });

    res.status(200).json({
      exito: true,
      total: libros.length,
      datos: libros,
    });
  } catch (error) {
    next(error);
  }
};

// GET /libros/:id -> Obtener un libro específico
const obtenerLibroPorId = async (req, res, next) => {
  try {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún libro con el id ${req.params.id}`,
      });
    }

    res.status(200).json({ exito: true, datos: libro });
  } catch (error) {
    // Si el id no tiene el formato válido de Mongo, CastError
    if (error.name === 'CastError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El id proporcionado no es válido',
      });
    }
    next(error);
  }
};

// POST /libros -> Crear un nuevo libro
const crearLibro = async (req, res, next) => {
  try {
    const { titulo, autor, anio, genero, estado } = req.body;

    const nuevoLibro = new Libro({ titulo, autor, anio, genero, estado });
    const libroGuardado = await nuevoLibro.save();

    res.status(201).json({
      exito: true,
      mensaje: 'Libro creado correctamente',
      datos: libroGuardado,
    });
  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ exito: false, mensaje: mensajes.join(', ') });
    }
    next(error);
  }
};

// PUT /libros/:id -> Actualizar un libro existente
const actualizarLibro = async (req, res, next) => {
  try {
    const { titulo, autor, anio, genero, estado } = req.body;

    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      { titulo, autor, anio, genero, estado },
      {
        new: true, // devuelve el documento ya actualizado
        runValidators: true, // vuelve a correr las validaciones del schema
      }
    );

    if (!libroActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún libro con el id ${req.params.id}`,
      });
    }

    res.status(200).json({
      exito: true,
      mensaje: 'Libro actualizado correctamente',
      datos: libroActualizado,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ exito: false, mensaje: mensajes.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El id proporcionado no es válido',
      });
    }
    next(error);
  }
};

// DELETE /libros/:id -> Eliminar un libro
const eliminarLibro = async (req, res, next) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);

    if (!libroEliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: `No se encontró ningún libro con el id ${req.params.id}`,
      });
    }

    res.status(200).json({
      exito: true,
      mensaje: 'Libro eliminado correctamente',
      datos: libroEliminado,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El id proporcionado no es válido',
      });
    }
    next(error);
  }
};

module.exports = {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};
