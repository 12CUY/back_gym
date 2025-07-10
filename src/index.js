const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/database');

// Importar todos los modelos (esto es importante para que Sequelize los registre)
const Rol = require('./models/sql/rolModel');
// Importa aquí todos tus modelos cuando los tengas
// const User = require('./models/sql/userModel');
// const Ejercicio = require('./models/sql/ejercicioModel');
// etc...

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas (comentadas hasta que las tengas)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// Agrega aquí más rutas

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API del Gym funcionando correctamente' });
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    // Autenticar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Sincronizar modelos con la base de datos
    // force: true recreará las tablas (solo para desarrollo)
    // alter: true actualizará las tablas existentes
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    return false;
  }
};

// Inicializar servidor
const startServer = async () => {
  const dbInitialized = await initializeDatabase();
  
  if (!dbInitialized) {
    console.error('❌ No se pudo inicializar la base de datos. Cerrando aplicación...');
    process.exit(1);
  }
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
};
    