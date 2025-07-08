const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Clase = sequelize.define('Clase', {
  id_clase: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  horario: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'clases',
  timestamps: false,
  indexes: [
    {
      fields: ['profesor_id']
    },
    {
      fields: ['nombre']
    }
  ]
});

module.exports = Clase;