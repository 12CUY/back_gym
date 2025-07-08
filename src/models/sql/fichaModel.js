const { sequelize, Sequelize } = require('../../config/database');
const DataTypes = Sequelize.DataTypes;

const Ficha = sequelize.define('Ficha', {
  id_ficha: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'fichas_entrenamiento',
  timestamps: false,
  indexes: [
    {
      fields: ['cliente_id']
    },
    {
      fields: ['profesor_id']
    }
  ]
});

module.exports = Ficha;