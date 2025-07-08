const { sequelize, DataTypes } = require('../sql/index');


const Trabajador = sequelize.define('Trabajador', {
  id_trabajador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[0-9()+-\s]+$/i
    }
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'trabajadores',
  timestamps: false,
  indexes: [
    {
      fields: ['correo'],
      unique: true
    },
    {
      fields: ['rol_id']
    }
  ]
});

module.exports = Trabajador;