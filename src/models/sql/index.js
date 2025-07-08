// Corrección en la ruta de importación de database
const { sequelize } = require('../config/database'); // Ahora es relativa a models/
const { DataTypes } = require('sequelize');

const Rol = require('./rolModel');
const Usuario = require('./usuarioModel');
const Configuracion = require('./configuracionModel');
const Cliente = require('./clienteModel');
const Membresia = require('./membresiaModel');
const Pago = require('./pagoModel');
const Visita = require('./visitaModel');
const Trabajador = require('./trabajadorModel');
const Profesor = require('./profesorModel');
const Clase = require('./claseModel');
const Reserva = require('./reservaModel');
const Ficha = require('./fichaModel');
const Producto = require('./productoModel');
const Inventario = require('./inventarioModel');

function definirAsociaciones() {
  try {
    // 1. Usuario -> Rol (RF14, RF15, HU01)
    Usuario.belongsTo(Rol, { 
      foreignKey: 'rol_id', 
      as: 'rol',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    Rol.hasMany(Usuario, { 
      foreignKey: 'rol_id', 
      as: 'usuarios'
    });

    // 2. Configuración -> Usuario (HU02)
    Configuracion.belongsTo(Usuario, { 
      foreignKey: 'creado_por', 
      as: 'creador',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Usuario.hasOne(Configuracion, { 
      foreignKey: 'creado_por', 
      as: 'configuracion'
    });

    // 3. Cliente -> Membresia (HU03, HU04)
    Cliente.belongsTo(Membresia, { 
      foreignKey: 'membresia_id', 
      as: 'membresia',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Membresia.hasMany(Cliente, { 
      foreignKey: 'membresia_id', 
      as: 'clientes'
    });

    // 4. Pago -> Cliente (HU05)
    Pago.belongsTo(Cliente, { 
      foreignKey: 'cliente_id', 
      as: 'cliente',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cliente.hasMany(Pago, { 
      foreignKey: 'cliente_id', 
      as: 'pagos'
    });

    // 5. Visita -> Cliente (HU05)
    Visita.belongsTo(Cliente, { 
      foreignKey: 'cliente_id', 
      as: 'cliente',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cliente.hasMany(Visita, { 
      foreignKey: 'cliente_id', 
      as: 'visitas'
    });

    // 6. Trabajador -> Rol (HU06)
    Trabajador.belongsTo(Rol, { 
      foreignKey: 'rol_id', 
      as: 'rol',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
    Rol.hasMany(Trabajador, { 
      foreignKey: 'rol_id', 
      as: 'trabajadores'
    });

    // 7. Clase -> Profesor (HU07)
    Clase.belongsTo(Profesor, { 
      foreignKey: 'profesor_id', 
      as: 'profesor',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Profesor.hasMany(Clase, { 
      foreignKey: 'profesor_id', 
      as: 'clases'
    });

    // 8. Reserva -> Cliente y Clase (HU07)
    Reserva.belongsTo(Cliente, { 
      foreignKey: 'cliente_id', 
      as: 'cliente',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cliente.hasMany(Reserva, { 
      foreignKey: 'cliente_id', 
      as: 'reservas'
    });

    Reserva.belongsTo(Clase, { 
      foreignKey: 'clase_id', 
      as: 'clase',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Clase.hasMany(Reserva, { 
      foreignKey: 'clase_id', 
      as: 'reservas'
    });

    // 9. Ficha -> Cliente y Profesor (HU08)
    Ficha.belongsTo(Cliente, { 
      foreignKey: 'cliente_id', 
      as: 'cliente',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cliente.hasMany(Ficha, { 
      foreignKey: 'cliente_id', 
      as: 'fichas'
    });

    Ficha.belongsTo(Profesor, { 
      foreignKey: 'profesor_id', 
      as: 'profesor',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Profesor.hasMany(Ficha, { 
      foreignKey: 'profesor_id', 
      as: 'fichas'
    });

    // 10. Inventario -> Producto (HU09 - Opcional)
    Inventario.belongsTo(Producto, { 
      foreignKey: 'producto_id', 
      as: 'producto',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Producto.hasMany(Inventario, { 
      foreignKey: 'producto_id', 
      as: 'inventarios'
    });

    console.log('✅ Todas las asociaciones configuradas correctamente');
  } catch (error) {
    console.error('❌ Error configurando asociaciones:', error);
    throw error;
  }
}

module.exports = {
  Rol,
  Usuario,
  Configuracion,
  Membresia,
  Cliente,
  Pago,
  Visita,
  Trabajador,
  Profesor,
  Clase,
  Reserva,
  Ficha,
  Producto,
  Inventario,
  definirAsociaciones
};