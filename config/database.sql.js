const { Sequelize } = require('sequelize');
const config = require('./keys');
const logger = require('./logger');

const sequelize = new Sequelize(
  config.MySQL.DATABASE,
  config.MySQL.USER,
  config.MySQL.PASSWORD,
  {
    host: config.MySQL.HOST,
    dialect: 'mysql',
    logging: msg => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      underscored: true
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión SQL establecida correctamente');
    return true;
  } catch (error) {
    logger.error('❌ Error de conexión SQL:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  DataTypes: Sequelize.DataTypes
};