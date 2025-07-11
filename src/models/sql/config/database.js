const { Sequelize } = require('sequelize');
const config = require('../../../config/keys');
const logger = require('../../../utils/logger');

const sequelize = new Sequelize(
  config.MySQL.DATABASE,
  config.MySQL.USER,
  config.MySQL.PASSWORD,
  {
    host: config.MySQL.HOST,
    dialect: 'mysql',
    logging: (msg, duration) => logger.sql(msg, duration),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Middleware para eventos de conexión
sequelize.addHook('afterConnect', (connection) => {
  logger.info('Nueva conexión establecida con la base de datos');
});

sequelize.addHook('afterDisconnect', (connection) => {
  logger.warn('Conexión con la base de datos cerrada');
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a MySQL establecida correctamente');
    return true;
  } catch (error) {
    logger.error('❌ Error de conexión a MySQL:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};