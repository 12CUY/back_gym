const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  fecha_pago: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metodo_pago: {
    type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
    allowNull: false
  }
}, {
  tableName: 'pagos',
  timestamps: false,
  indexes: [
    {
      fields: ['cliente_id']
    },
    {
      fields: ['fecha_pago']
    }
  ]
});

module.exports = Pago;