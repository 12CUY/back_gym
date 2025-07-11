// src/models/sql/rolModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./config/database'); // <--- CORRECCIÓN AQUÍ (dos niveles arriba)

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Agrega otros campos para el modelo Rol si los tienes
}, {
  tableName: 'roles', // Opcional: especifica el nombre de la tabla
  timestamps: true // Añade los campos createdAt y updatedAt automáticamente
});

module.exports = Rol;