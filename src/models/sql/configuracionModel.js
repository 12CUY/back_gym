const { DataTypes } = require('sequelize');
const { sequelize } = require('./config/database');

const Configuracion = sequelize.define('Configuracion', {
  id_config: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mision: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  objetivos: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'configuracion_sitio',
  timestamps: false
});

module.exports = Configuracion;