const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const proyectoRoutes = require('./routes/proyecto.routes');
const capaUnoRoutes = require('./routes/capaUno.routes');
const capaDosRoutes = require('./routes/capaDos.routes');
const capaTresRoutes = require('./routes/capaTres.routes');
const capaCuatroRoutes = require('./routes/capaCuatro.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Modo solo mockup - sin conexión a MongoDB
logger.info('🎭 Aplicación en modo DEMO con datos mockup');

// Middleware de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por ventana
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de peticiones
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Rutas de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/capa-uno', capaUnoRoutes);
app.use('/api/capa-dos', capaDosRoutes);
app.use('/api/capa-tres', capaTresRoutes);
app.use('/api/capa-cuatro', capaCuatroRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  logger.info(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
