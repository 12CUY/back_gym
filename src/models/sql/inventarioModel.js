const { sequelize, DataTypes } = require('../sql/index');


const Inventario = sequelize.define('Inventario', {
  id_inventario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  fecha_actualizacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inventario',
  timestamps: false,
  indexes: [
    {
      fields: ['producto_id']
    }
  ]
});

module.exports = Inventario;