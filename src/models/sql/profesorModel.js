const { sequelize, DataTypes } = require('../sql/index');

const Profesor = sequelize.define('Profesor', {
  id_profesor: {
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
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'profesores',
  timestamps: false,
  indexes: [
    {
      fields: ['correo'],
      unique: true
    }
  ]
});

module.exports = Profesor;