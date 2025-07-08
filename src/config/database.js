const { Sequelize } = require('sequelize');
const config = require('./keys'); // Ahora busca en el mismo directorio

const sequelize = new Sequelize(
  config.MySQL.DATABASE,
  config.MySQL.USER,
  config.MySQL.PASSWORD,
  {
    host: config.MySQL.HOST,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};