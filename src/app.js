require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize, testConnection } = require('../config/database.sql');
const { setupAssociations } = require('./models/sql');
const config = require('../config/keys');
const logger = require('../config/logger');

// Inicializar Express
const app = express();

// Middlewares esenciales
app.use(helmet());
app.use(cors({
  origin: config.MODE_ENV === 'development' ? '*' : process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const initializeDatabase = async () => {
  try {
    logger.info('⏳ Inicializando base de datos...');
    
    const isConnected = await testConnection();
    if (!isConnected) throw new Error('No se pudo conectar a la base de datos');
    
    await sequelize.sync({
      alter: config.MODE_ENV === 'development',
      force: false
    });
    
    setupAssociations();
    logger.info('✅ Base de datos inicializada correctamente');
  } catch (error) {
    logger.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
};

// Rutas básicas de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    database: config.MySQL.DATABASE,
    environment: config.MODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: config.MODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const startServer = async () => {
  await initializeDatabase();
  
  const PORT = config.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    logger.info(`🔧 Entorno: ${config.MODE_ENV}`);
    logger.info(`💾 Base de datos: ${config.MySQL.DATABASE}`);
  });
};

startServer().catch(err => {
  logger.error('❌ Error crítico al iniciar:', err);
  process.exit(1);
});

module.exports = app;