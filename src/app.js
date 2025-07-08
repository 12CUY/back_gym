require('dotenv').config();
const express = require('express');

// Importación CORRECTA según estructura recomendada
const config = require('./config/keys'); 
const { sequelize, testConnection } = require('./config/database');
const { definirAsociaciones } = require('./models/index');
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
    definirAsociaciones();

    // Sincronizar modelos
    console.log('⏳ Sincronizando modelos con la base de datos...');
    await sequelize.sync({
      alter: config.MODE_ENV === 'development',
      force: false
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
  await initializeDatabase();

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