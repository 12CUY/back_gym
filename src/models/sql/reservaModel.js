const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('Confirmada', 'Cancelada', 'Completada'),
    allowNull: false,
    defaultValue: 'Confirmada'
  }
}, {
  tableName: 'reservas',
  timestamps: false,
  indexes: [
    {
      fields: ['cliente_id']
    },
    {
      fields: ['clase_id']
    },
    {
      fields: ['fecha_reserva']
    }
  ]
});

module.exports = Reserva;