// models/Libro.js
// Modelo (M de MVC): define la forma de los documentos en la colección "libros"
// y las validaciones que Mongoose aplica automáticamente antes de guardar.

const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [1, 'El título no puede estar vacío'],
      maxlength: [200, 'El título no puede superar los 200 caracteres'],
    },
    autor: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
      maxlength: [150, 'El autor no puede superar los 150 caracteres'],
    },
    anio: {
      type: Number,
      required: [true, 'El año de publicación es obligatorio'],
      min: [0, 'El año no puede ser negativo'],
      max: [new Date().getFullYear(), 'El año no puede ser mayor al actual'],
    },
    genero: {
      type: String,
      trim: true,
      default: 'Sin especificar',
    },
    estado: {
      type: String,
      enum: {
        values: ['disponible', 'prestado'],
        message: 'El estado debe ser "disponible" o "prestado"',
      },
      default: 'disponible',
    },
  },
  {
    // Agrega automáticamente los campos createdAt y updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model('Libro', libroSchema, 'libros');
