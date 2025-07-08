const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Visita = sequelize.define('Visita', {
  id_visita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_visita: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'visitas',
  timestamps: false,
  indexes: [
    {
      fields: ['cliente_id']
    },
    {
      fields: ['fecha_visita']
    }
  ]
});

module.exports = Visita;