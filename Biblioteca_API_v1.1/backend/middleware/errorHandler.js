// middleware/errorHandler.js
// Middleware centralizado de manejo de errores.
// Cualquier error no controlado en los controladores llega acá mediante next(error).

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error capturado por el middleware:', err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
  });
};

// Middleware para rutas no encontradas (404)
const rutaNoEncontrada = (req, res, next) => {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, rutaNoEncontrada };
