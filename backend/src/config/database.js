const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
    });

    logger.info(`✅ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`❌ Error conectando a MongoDB: ${error.message}`);
    throw error; // Lanzar error en lugar de terminar el proceso
  }
};

module.exports = connectDB;
