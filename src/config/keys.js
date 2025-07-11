require('dotenv').config();
const fs = require('fs');
const path = require('path');

const config = {
  // ===================
  // CONFIGURACIÓN GENERAL
  // ===================
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'Gym Backend',
  API_VERSION: process.env.API_VERSION || 'v1',
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,

  // ===================
  // CONFIGURACIÓN DE BASE DE DATOS (Mejorada)
  // ===================
  MySQL: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DATABASE: process.env.DB_NAME || 'gym_db',
    PORT: process.env.DB_PORT || 3306,
    DIALECT: 'mysql',
    TIMEZONE: process.env.DB_TIMEZONE || '+00:00',
    POOL: {
      MAX: parseInt(process.env.DB_POOL_MAX) || 10,
      MIN: parseInt(process.env.DB_POOL_MIN) || 0,
      ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000
    },

    
    SSL: {
      ENABLED: process.env.DB_SSL_ENABLED === 'true',
      REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      CA: process.env.DB_SSL_CA || null,
      CERT: process.env.DB_SSL_CERT || null,
      KEY: process.env.DB_SSL_KEY || null
    },
    LOGGING: {
      ENABLED: process.env.DB_LOGGING_ENABLED !== 'false',
      LEVEL: process.env.DB_LOG_LEVEL || 'info',
      TIMEOUT: parseInt(process.env.DB_LOG_TIMEOUT) || 5000
    }
  },

  // ===================
  // CONFIGURACIÓN JWT (Mejorada)
  // ===================
  JWT: {
    SECRET: process.env.JWT_SECRET || 'default_jwt_secret_CHANGE_IN_PRODUCTION',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_CHANGE_IN_PRODUCTION',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    ISSUER: process.env.JWT_ISSUER || 'gym-app',
    AUDIENCE: process.env.JWT_AUDIENCE || 'gym-users',
    ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
    COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'gym_token',
    COOKIE_HTTP_ONLY: process.env.JWT_COOKIE_HTTP_ONLY !== 'false',
    COOKIE_SECURE: process.env.NODE_ENV === 'production'
  },

  // ===================
  // CONFIGURACIÓN DE BCRYPT (Mejorada)
  // ===================
  BCRYPT: {
    SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    HASH_VERSION: process.env.BCRYPT_HASH_VERSION || '2b'
  },

  // ===================
  // CONFIGURACIÓN DE RATE LIMITING (Mejorada)
  // ===================
  RATE_LIMIT: {
    ENABLED: process.env.RATE_LIMIT_ENABLED !== 'false',
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    MESSAGE: process.env.RATE_LIMIT_MESSAGE || 'Demasiadas peticiones, intenta más tarde',
    HEADERS: process.env.RATE_LIMIT_HEADERS === 'true',
    SKIP: process.env.RATE_LIMIT_SKIP || null, // Ej: '127.0.0.1,192.168.1.1'
    LOGIN: {
      WINDOW_MS: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      MAX_REQUESTS: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS) || 5,
      MESSAGE: process.env.LOGIN_RATE_LIMIT_MESSAGE || 'Demasiados intentos de login'
    }
  },

  // ===================
  // CONFIGURACIÓN DE CORS (Mejorada)
  // ===================
  CORS: {
    ENABLED: process.env.CORS_ENABLED !== 'false',
    ORIGIN: process.env.CORS_ORIGIN ?
      process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) :
      ['http://localhost:3000', 'http://localhost:3001'],
    CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
    METHODS: process.env.CORS_METHODS ?
      process.env.CORS_METHODS.split(',') :
      ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: process.env.CORS_ALLOWED_HEADERS ?
      process.env.CORS_ALLOWED_HEADERS.split(',') :
      ['Content-Type', 'Authorization', 'X-Requested-With'],
    EXPOSED_HEADERS: process.env.CORS_EXPOSED_HEADERS ?
      process.env.CORS_EXPOSED_HEADERS.split(',') :
      [],
    MAX_AGE: parseInt(process.env.CORS_MAX_AGE) || 86400 // 24 horas
  },

  // ===================
  // CONFIGURACIÓN DE SESIONES (Mejorada)
  // ===================
  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'session_secret_CHANGE_IN_PRODUCTION',
    RESAVE: process.env.SESSION_RESAVE === 'true',
    SAVE_UNINITIALIZED: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
    STORE: process.env.SESSION_STORE || 'memory', // memory, redis, etc.
    COOKIE: {
      NAME: process.env.SESSION_COOKIE_NAME || 'gym.sid',
      SECURE: process.env.NODE_ENV === 'production',
      HTTP_ONLY: true,
      SAME_SITE: process.env.SESSION_COOKIE_SAME_SITE || 'lax',
      MAX_AGE: parseInt(process.env.SESSION_MAX_AGE) || 86400000, // 24 horas
      DOMAIN: process.env.SESSION_COOKIE_DOMAIN || null
    },
    REDIS: {
      HOST: process.env.REDIS_HOST || 'localhost',
      PORT: process.env.REDIS_PORT || 6379,
      PASSWORD: process.env.REDIS_PASSWORD || null
    }
  },

  // ===================
  // CONFIGURACIÓN DE LOGS (Mejorada)
  // ===================
  LOGS: {
    DIR: process.env.LOG_DIR || path.join(__dirname, '../logs'),
    LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    ENABLE_CONSOLE: process.env.LOG_ENABLE_CONSOLE !== 'false',
    ENABLE_FILE: process.env.LOG_ENABLE_FILE !== 'false',
    FILE: {
      MAIN: process.env.LOG_MAIN_FILE || 'app.log',
      ERROR: process.env.LOG_ERROR_FILE || 'error.log',
      EXCEPTIONS: process.env.LOG_EXCEPTIONS_FILE || 'exceptions.log'
    },
    MAX_SIZE: process.env.LOG_MAX_SIZE || '20m',
    MAX_FILES: process.env.LOG_MAX_FILES || '14d',
    FORMAT: process.env.LOG_FORMAT || 'combined', // combined, json, simple, etc.
    ALERTS: {
      ERROR_THRESHOLD: parseInt(process.env.LOG_ERROR_ALERT_THRESHOLD) || 5,
      WARN_THRESHOLD: parseInt(process.env.LOG_WARN_ALERT_THRESHOLD) || 10,
      EMAIL: process.env.LOG_ALERT_EMAIL || null,
      SLACK_WEBHOOK: process.env.LOG_ALERT_SLACK_WEBHOOK || null
    }
  },

  // ===================
  // CONFIGURACIÓN DE HELMET (Mejorada)
  // ===================
  HELMET: {
    ENABLED: process.env.HELMET_ENABLED !== 'false',
    CONTENT_SECURITY_POLICY: {
      ENABLED: process.env.HELMET_CSP_ENABLED !== 'false',
      DIRECTIVES: process.env.HELMET_CSP_DIRECTIVES ? 
        JSON.parse(process.env.HELMET_CSP_DIRECTIVES) : 
        { defaultSrc: ["'self'"] }
    },
    HSTS: {
      ENABLED: process.env.HELMET_HSTS_ENABLED !== 'false',
      MAX_AGE: parseInt(process.env.HELMET_HSTS_MAX_AGE) || 31536000, // 1 año
      INCLUDE_SUBDOMAINS: process.env.HELMET_HSTS_INCLUDE_SUBDOMAINS !== 'false',
      PRELOAD: process.env.HELMET_HSTS_PRELOAD === 'true'
    },
    XSS_FILTER: process.env.HELMET_XSS_FILTER !== 'false',
    NO_SNIFF: process.env.HELMET_NO_SNIFF !== 'false',
    IENOOPEN: process.env.HELMET_IENOOPEN !== 'false',
    FRAMEGUARD: {
      ENABLED: process.env.HELMET_FRAMEGUARD_ENABLED !== 'false',
      ACTION: process.env.HELMET_FRAMEGUARD_ACTION || 'SAMEORIGIN'
    }
  },

  // ===================
  // CONFIGURACIÓN DE UPLOADS (Mejorada)
  // ===================
  UPLOADS: {
    DIR: process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'),
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    TEMP_DIR: process.env.UPLOAD_TEMP_DIR || path.join(__dirname, '../temp'),
    ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES ?
      process.env.ALLOWED_MIME_TYPES.split(',') :
      [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'text/csv',
        'application/zip', 'application/x-rar-compressed',
        'audio/mpeg', 'audio/wav',
        'video/mp4', 'video/avi', 'video/quicktime'
      ],
    ALLOWED_EXTENSIONS: process.env.ALLOWED_EXTENSIONS ?
      process.env.ALLOWED_EXTENSIONS.split(',') :
      [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.txt', '.csv',
        '.zip', '.rar',
        '.mp3', '.wav',
        '.mp4', '.avi', '.mov'
      ],
    IMAGE: {
      QUALITY: parseInt(process.env.IMAGE_QUALITY) || 80,
      RESIZE: {
        WIDTH: parseInt(process.env.IMAGE_RESIZE_WIDTH) || 1024,
        HEIGHT: parseInt(process.env.IMAGE_RESIZE_HEIGHT) || 768
      }
    }
  },

  // ===================
  // CONFIGURACIÓN DE EMAIL (Mejorada)
  // ===================
  EMAIL: {
    ENABLED: process.env.EMAIL_ENABLED === 'true',
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT) || 587,
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@gym-app.com',
    TEMPLATES_DIR: process.env.EMAIL_TEMPLATES_DIR || path.join(__dirname, '../email-templates'),
    CONNECTION_TIMEOUT: parseInt(process.env.EMAIL_CONNECTION_TIMEOUT) || 10000,
    POOL: process.env.EMAIL_POOL === 'true',
    MAX_CONNECTIONS: parseInt(process.env.EMAIL_MAX_CONNECTIONS) || 5,
    RATE_LIMIT: {
      MAX: parseInt(process.env.EMAIL_RATE_LIMIT_MAX) || 100,
      DELAY: parseInt(process.env.EMAIL_RATE_LIMIT_DELAY) || 1000
    }
  },

  // ===================
  // CONFIGURACIÓN DE VALIDACIÓN (Mejorada)
  // ===================
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
      REQUIRE_UPPERCASE: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
      REQUIRE_LOWERCASE: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
      REQUIRE_NUMBERS: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
      REQUIRE_SYMBOLS: process.env.PASSWORD_REQUIRE_SYMBOLS !== 'false',
      BANNED_PASSWORDS: process.env.PASSWORD_BANNED_LIST ?
        process.env.PASSWORD_BANNED_LIST.split(',') :
        ['password', '12345678', 'qwerty']
    },
    USERNAME: {
      MIN_LENGTH: parseInt(process.env.USERNAME_MIN_LENGTH) || 3,
      MAX_LENGTH: parseInt(process.env.USERNAME_MAX_LENGTH) || 30,
      ALLOWED_CHARS: process.env.USERNAME_ALLOWED_CHARS || 'a-zA-Z0-9_'
    },
    EMAIL: {
      VERIFY_DOMAIN: process.env.EMAIL_VERIFY_DOMAIN === 'true',
      DISPOSABLE_BLOCK: process.env.EMAIL_BLOCK_DISPOSABLE === 'true'
    }
  },

  // ===================
  // CONFIGURACIÓN DE MONITOREO (Nueva)
  // ===================
  MONITORING: {
    ENABLED: process.env.MONITORING_ENABLED === 'true',
    INTERVAL: parseInt(process.env.MONITORING_INTERVAL) || 60000, // 1 minuto
    MEMORY_THRESHOLD: parseFloat(process.env.MEMORY_THRESHOLD) || 0.8, // 80%
    CPU_THRESHOLD: parseFloat(process.env.CPU_THRESHOLD) || 0.8, // 80%
    HEAP_THRESHOLD: parseFloat(process.env.HEAP_THRESHOLD) || 0.8, // 80%
    EVENT_LOOP_THRESHOLD: parseInt(process.env.EVENT_LOOP_THRESHOLD) || 100, // ms
    ALERT_CHANNELS: process.env.MONITORING_ALERT_CHANNELS ?
      process.env.MONITORING_ALERT_CHANNELS.split(',') :
      ['console']
  },

  // ===================
  // CONFIGURACIÓN DE SEGURIDAD (Nueva)
  // ===================
  SECURITY: {
    REQUEST_LIMIT: process.env.REQUEST_LIMIT || '100kb',
    HEADERS: {
      XSS: process.env.HEADER_XSS_PROTECTION !== 'false',
      CSP: process.env.HEADER_CSP_ENABLED !== 'false',
      HSTS: process.env.HEADER_HSTS_ENABLED !== 'false'
    },
    CSRF: {
      ENABLED: process.env.CSRF_ENABLED === 'true',
      COOKIE_NAME: process.env.CSRF_COOKIE_NAME || '_csrf',
      SECRET: process.env.CSRF_SECRET || 'csrf_secret_CHANGE_IN_PRODUCTION'
    },
    BRUTE_FORCE: {
      LOGIN: {
        ATTEMPTS: parseInt(process.env.BRUTE_FORCE_LOGIN_ATTEMPTS) || 5,
        LOCKOUT_TIME: parseInt(process.env.BRUTE_FORCE_LOCKOUT_TIME) || 15 * 60 * 1000 // 15 min
      }
    }
  },

  // ===================
  // CONFIGURACIÓN DE DOCUMENTACIÓN (Nueva)
  // ===================
  DOCS: {
    ENABLED: process.env.NODE_ENV !== 'production',
    PATH: process.env.DOCS_PATH || '/api-docs',
    TITLE: process.env.DOCS_TITLE || 'Gym API Documentation',
    VERSION: process.env.DOCS_VERSION || '1.0.0',
    DESCRIPTION: process.env.DOCS_DESCRIPTION || 'API documentation for Gym Backend',
    CONTACT: {
      NAME: process.env.DOCS_CONTACT_NAME || 'API Support',
      EMAIL: process.env.DOCS_CONTACT_EMAIL || 'support@gym-app.com',
      URL: process.env.DOCS_CONTACT_URL || 'https://gym-app.com/support'
    },
    LICENSE: {
      NAME: process.env.DOCS_LICENSE_NAME || 'MIT',
      URL: process.env.DOCS_LICENSE_URL || 'https://opensource.org/licenses/MIT'
    }
  }
};

// ===================
// VERIFICACIÓN DE CONFIGURACIÓN
// ===================
(function checkConfig() {
  const env = config.NODE_ENV;
  const warnings = [];
  const errors = [];

  // Verificar configuraciones sensibles en producción
  if (env === 'production') {
    if (config.JWT.SECRET.includes('CHANGE_IN_PRODUCTION')) {
      errors.push('JWT_SECRET no configurado para producción');
    }
    if (config.SESSION.SECRET.includes('CHANGE_IN_PRODUCTION')) {
      errors.push('SESSION_SECRET no configurado para producción');
    }
    if (!process.env.DB_PASSWORD) {
      errors.push('DB_PASSWORD no configurado para producción');
    }
    if (config.EMAIL.ENABED && (!config.EMAIL.USER || !config.EMAIL.PASS)) {
      warnings.push('Email habilitado pero faltan credenciales');
    }
  }

  // Verificar directorios necesarios
  const requiredDirs = [config.LOGS.DIR, config.UPLOADS.DIR, config.UPLOADS.TEMP_DIR];
  requiredDirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      errors.push(`No se pudo crear el directorio ${dir}: ${err.message}`);
    }
  });

  // Exportar resultados de verificación
  config.CONFIG_CHECK = {
    warnings,
    errors,
    isValid: errors.length === 0,
    timestamp: new Date().toISOString()
  };

  // Mostrar advertencias en consola
  if (warnings.length > 0) {
    console.warn('⚠️ Advertencias de configuración:');
    warnings.forEach(warning => console.warn(`- ${warning}`));
  }

  // Mostrar errores en consola y salir si es producción
  if (errors.length > 0) {
    console.error('❌ Errores de configuración crítica:');
    errors.forEach(error => console.error(`- ${error}`));
    
    if (env === 'production') {
      process.exit(1);
    }
  }
})();

module.exports = config;