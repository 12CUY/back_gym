// variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const config = require('./config/keys'); // Asumiendo que keys.js está en src/config/

// Importaciones de tu configuración de base de datos
const { sequelize, testConnection } = require('./config/database');
const { definirAsociaciones } = require('./models/sql/index'); // Ajusta la ruta si es necesario

const app = express();

// ===========================================
// 2. CONFIGURACIÓN DE LOGGING (Morgan)
// ===========================================

const logsDir = path.dirname(config.LOGS.FILE);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

if (config.NODE_ENV === 'production') {
    // En producción: Solo errores a archivo para evitar sobrecargar la consola.
    // Usamos config.LOGS.ERROR_FILE que ya está definido en tu keys.js
    app.use(morgan('combined', {
        skip: (req, res) => res.statusCode < 400,
        stream: fs.createWriteStream(config.LOGS.ERROR_FILE, { flags: 'a' })
    }));

} else {
    app.use(morgan('dev'));
}

// ===========================================
// 3. MIDDLEWARES DE SEGURIDAD ESENCIALES (Helmet, Rate Limiting, CORS)
// ===========================================

// Helmet: Establece varios encabezados HTTP para proteger la app de vulnerabilidades conocidas.
app.use(helmet({
    contentSecurityPolicy: config.HELMET.CONTENT_SECURITY_POLICY ? {

        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            // ... otras directivas
        }
    } : false, // Si es false, CSP se deshabilita.
    // HTTP Strict Transport Security (HSTS): Fuerza el uso de HTTPS.
    hsts: config.HELMET.HSTS.ENABLED ? {
        maxAge: config.HELMET.HSTS.MAX_AGE,
        includeSubDomains: config.HELMET.HSTS.INCLUDE_SUBDOMAINS
    } : false
}));

const apiLimiter = rateLimit({
    windowMs: config.RATE_LIMIT.WINDOW_MS,
    max: config.RATE_LIMIT.MAX_REQUESTS,
    message: {
        error: config.RATE_LIMIT.MESSAGE,
        code: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip
});
app.use('/api/', apiLimiter);

const authLimiter = rateLimit({
    windowMs: config.RATE_LIMIT.LOGIN_WINDOW_MS,
    max: config.RATE_LIMIT.LOGIN_MAX_REQUESTS,
    message: {
        error: 'Demasiados intentos de login. Por favor, intenta de nuevo más tarde.',
        code: 'TOO_MANY_LOGIN_ATTEMPTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// CORS (Cross-Origin Resource Sharing): Controla quién puede acceder a tu API.
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (config.CORS.ORIGIN.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por la política CORS.'));
        }
    },
    credentials: config.CORS.CREDENTIALS,
    methods: config.CORS.METHODS,
    allowedHeaders: config.CORS.ALLOWED_HEADERS,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ===========================================
// 4. MIDDLEWARES DE PARSING Y SEGURIDAD ADICIONAL
// ===========================================

// Parsing de JSON: Limita el tamaño del cuerpo y valida el formato JSON.
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            throw new Error('JSON_MALFORMED');
        }
    }
}));

// Parsing de datos URL-encoded: Limita el tamaño.
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// Middleware personalizado: Remueve headers que revelan información del servidor (seguridad por "oscurecimiento").
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    next();
});

// Middleware: Valida que las solicitudes POST/PUT/PATCH tengan Content-Type: application/json.
app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        if (!req.get('Content-Type') || !req.get('Content-Type').includes('application/json')) {
            return res.status(400).json({
                error: 'Content-Type debe ser application/json para esta solicitud.',
                code: 'INVALID_CONTENT_TYPE'
            });
        }
    }
    next();
});

// Middleware: Captura la IP real del cliente para logging y auditoría.
app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    req.clientIp = clientIp;
    next();
});

// ===========================================
// 5. CONFIGURACIÓN DE SESIONES (si usas sesiones además de/en lugar de JWT)
// ===========================================


// ===========================================
// 6. AUTENTICACIÓN (Passport.js - si lo usas)
// ===========================================

// ===========================================
// 7. RUTAS DE SALUD Y ESTADO (para monitoreo)
// ===========================================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        message: 'API del Gym funcionando correctamente',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// ===========================================
// 8. TUS RUTAS DE LA API
// ===========================================
// Aquí es donde importarías y usarías tus módulos de rutas.


// Tu ruta de prueba original
app.get('/', (req, res) => {
    res.json({
        message: 'Backend de Gimnasio Funcionando',
        status: 'OK',
        environment: config.NODE_ENV
    });
});

// ===========================================
// 9. MANEJO DE ERRORES (Importante para seguridad y experiencia de usuario)
// ===========================================

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        code: 'ROUTE_NOT_FOUND',
        path: req.originalUrl,
        method: req.method
    });
});

// Middleware global de manejo de errores. DEBE IR AL FINAL, DESPUÉS DE TODOS LOS MIDDLEWARES Y RUTAS.
app.use((err, req, res, next) => {
    if (config.NODE_ENV !== 'production') {
        console.error('Error no capturado:', err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = 'Error interno del servidor';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    // Manejo de errores específicos
    if (err.message === 'No permitido por la política CORS.') {
        statusCode = 403;
        message = 'Origen de solicitud no permitido por CORS.';
        errorCode = 'CORS_FORBIDDEN';
    } else if (err.message === 'JSON_MALFORMED') {
        statusCode = 400;
        message = 'El cuerpo de la solicitud contiene JSON malformado.';
        errorCode = 'INVALID_JSON_FORMAT';
    }


    // En producción, no revelar detalles de errores internos.
    if (config.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Ha ocurrido un error inesperado en el servidor.';
    } else {
        message = err.message || message;
    }

    res.status(statusCode).json({
        error: message,
        code: errorCode,
        ...(config.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ===========================================
// 10. INICIALIZACIÓN DE LA BASE DE DATOS Y ARRANQUE DEL SERVIDOR
// ===========================================
// Esta lógica se mantiene de tu primer archivo, asegurando la DB antes de iniciar el servidor.

const initializeDatabase = async () => {
    try {
        console.log('🔗 Intentando conectar a la base de datos...');
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('No se pudo establecer conexión con la base de datos.');
        }
        console.log('✅ Conexión a la base de datos establecida.');

        // Definir asociaciones de modelos (si usas Sequelize con asociaciones)
        if (typeof definirAsociaciones === 'function') {
            definirAsociaciones();
            console.log('🧩 Asociaciones de modelos definidas.');
        }

        // Sincronizar modelos con la base de datos
        console.log('⏳ Sincronizando modelos con la base de datos...');
        await sequelize.sync({
            alter: config.NODE_ENV === 'development',
            force: false
        });
        console.log('✅ Modelos sincronizados con la base de datos correctamente.');
    } catch (error) {
        console.error('❌ Error crítico al inicializar la base de datos:', error);
        process.exit(1);
    }
};

const startServer = async () => {
    await initializeDatabase();

    const PORT = config.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📌 Entorno: ${config.NODE_ENV}`);
        console.log(`💾 Base de datos MySQL: ${config.MySQL.DATABASE}`);
    });
};

startServer().catch(err => {
    console.error('❌ Error al iniciar la aplicación:', err);
    process.exit(1);
});

module.exports = app;