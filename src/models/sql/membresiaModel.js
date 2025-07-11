const { DataTypes } = require('sequelize');
const { sequelize } = require('./config/database');
const Membresia = sequelize.define('Membresia', {
  id_membresia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  duracion_dias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'membresias',
  timestamps: false
});

module.exports = Membresia;