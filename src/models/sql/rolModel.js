const { sequelize, Sequelize } = require('../../config/database');
const DataTypes = Sequelize.DataTypes;

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['Administrador', 'Recepcionista', 'Entrenador', 'Cliente']]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;