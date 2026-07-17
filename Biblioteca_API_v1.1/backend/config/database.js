// config/database.js
// Encargado exclusivamente de la conexión a MongoDB mediante Mongoose.

const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/biblioteca_digital';

    await mongoose.connect(uri);

    console.log('✅ Conexión a MongoDB establecida correctamente');
    console.log(`   Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    // Si no se puede conectar a la base de datos, no tiene sentido
    // seguir levantando el servidor.
    process.exit(1);
  }
};

module.exports = conectarDB;
