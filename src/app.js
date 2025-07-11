require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger'); // Asegúrate de que esta ruta es correcta

const config = require('./config/keys');

// Importaciones de base de datos
const { sequelize, testConnection } = require('./config/database');
const { definirAsociaciones } = require('./models/sql/index');

const app = express();

// ===========================================
// 1. CONFIGURACIÓN DE DIRECTORIOS DE LOGS
// ===========================================

// Corregimos el problema de path aquí
const logsDir = path.resolve(__dirname, '../logs'); // Ajusta según tu estructura
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// ===========================================
// 2. CONFIGURACIÓN DE MORGAN CON WINSTON
// ===========================================
app.use(morgan('combined', { 
    stream: logger.stream,
    skip: (req, res) => res.statusCode < 400 && config.NODE_ENV === 'production'
}));

// ===========================================
// 3. MIDDLEWARES DE SEGURIDAD
// ===========================================
app.use(helmet({
    contentSecurityPolicy: config.HELMET.CONTENT_SECURITY_POLICY ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        }
    } : false,
    hsts: config.HELMET.HSTS.ENABLED ? {
        maxAge: config.HELMET.HSTS.MAX_AGE,
        includeSubDomains: config.HELMET.HSTS.INCLUDE_SUBDOMAINS
    } : false
}));

const apiLimiter = rateLimit({
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    max: config.RATE_LIMIT.MAX_REQUESTS,
    message: config.RATE_LIMIT.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', apiLimiter);

app.use(cors({
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
    methods: config.CORS.METHODS,
    allowedHeaders: config.CORS.ALLOWED_HEADERS
}));

// ===========================================
// 4. MIDDLEWARES BÁSICOS
// ===========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
});

// ===========================================
// 5. RUTAS
// ===========================================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        environment: config.NODE_ENV
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Backend de Gimnasio Funcionando',
        status: 'OK'
    });
});

// ===========================================
// 6. MANEJO DE ERRORES
// ===========================================
app.use((err, req, res, next) => {
    logger.error('Error no manejado:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(500).json({ 
        error: 'Ocurrió un error en el servidor',
        ...(config.NODE_ENV !== 'production' && { details: err.message })
    });
});

// ===========================================
// 7. INICIALIZACIÓN DEL SERVIDOR
// ===========================================
const startServer = async () => {
    try {
        logger.info('🔗 Intentando conectar a la base de datos...');
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        logger.info('✅ Conexión a la base de datos establecida');

        if (typeof definirAsociaciones === 'function') {
            definirAsociaciones();
            logger.info('🧩 Asociaciones de modelos definidas');
        }

        await sequelize.sync({
            alter: config.NODE_ENV === 'development',
            force: false
        });
        logger.info('🔄 Modelos sincronizados con la base de datos');

        const PORT = config.PORT || 3000;
        app.listen(PORT, () => {
            logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            logger.info(`📌 Entorno: ${config.NODE_ENV}`);
            logger.info(`💾 Base de datos: ${config.MySQL.DATABASE}`);
        });
    } catch (error) {
        logger.fatal('❌ Error al iniciar la aplicación:', {
            message: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
};

startServer();

module.exports = app;