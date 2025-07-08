// src/app.js
require('dotenv').config(); // Asegúrate de que esto esté al principio para cargar las variables de entorno
const express = require('express');

// Importación CORRECTA según estructura de carpetas
const config = require('./config/keys');
const { sequelize, testConnection } = require('./config/database');
const { definirAsociaciones } = require('./models/sql/index'); // <--- CORRECCIÓN AQUÍ

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicialización de la base de datos
const initializeDatabase = async () => {
  try {
    // Verificar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Configurar asociaciones
    definirAsociaciones(); // Llama a la función para establecer las asociaciones

    // Sincronizar modelos
    console.log('⏳ Sincronizando modelos con la base de datos...');
    await sequelize.sync({
      alter: config.MODE_ENV === 'development', // 'alter' intentará modificar tablas para que coincidan con los cambios del modelo
      force: false // Establece a 'true' SÓLO para desarrollo si quieres borrar y recrear tablas en cada reinicio
    });
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Backend de Gimnasio Funcionando',
    status: 'OK',
    environment: config.MODE_ENV
  });
});

// Iniciar servidor
const startServer = async () => {
  await initializeDatabase(); // Asegura que la base de datos se inicialice antes de iniciar el servidor

  const PORT = config.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📌 Entorno: ${config.MODE_ENV}`);
    console.log(`💾 Base de datos: ${config.MySQL.DATABASE}`);
  });
};

startServer().catch(err => {
  console.error('❌ Error al iniciar la aplicación:', err);
  process.exit(1);
});