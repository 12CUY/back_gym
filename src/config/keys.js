require('dotenv').config();

module.exports = {
  // ===================
  // CONFIGURACIÓN GENERAL
  // ===================
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // ===================
  // CONFIGURACIÓN DE BASE DE DATOS
  // ===================
  MySQL: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DATABASE: process.env.DB_NAME || 'gym_db',
    PORT: process.env.DB_PORT || 3306,
    // Configuraciones de seguridad para conexión
    POOL: {
      MAX: parseInt(process.env.DB_POOL_MAX) || 10,
      MIN: parseInt(process.env.DB_POOL_MIN) || 0,
      ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 60000,
      IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    // Configuraciones SSL (para producción)
    SSL: {
      ENABLED: process.env.DB_SSL_ENABLED === 'true',
      REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  },

  // ===================
  // CONFIGURACIÓN JWT
  // ===================
  JWT: {
    SECRET: process.env.JWT_SECRET || 'default_jwt_secret_CHANGE_IN_PRODUCTION',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_CHANGE_IN_PRODUCTION',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    ISSUER: process.env.JWT_ISSUER || 'gym-app',
    AUDIENCE: process.env.JWT_AUDIENCE || 'gym-users'
  },

  // ===================
  // CONFIGURACIÓN DE BCRYPT
  // ===================
  BCRYPT: {
    SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
  },

  // ===================
  // CONFIGURACIÓN DE RATE LIMITING
  // ===================
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    MESSAGE: process.env.RATE_LIMIT_MESSAGE || 'Demasiadas peticiones, intenta más tarde',
    // Rate limiting específico para login
    LOGIN_WINDOW_MS: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    LOGIN_MAX_REQUESTS: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS) || 5
  },

  // ===================
  // CONFIGURACIÓN DE CORS
  // ===================
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
      ['http://localhost:3000', 'http://localhost:3001'],
    CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
    METHODS: process.env.CORS_METHODS ? 
      process.env.CORS_METHODS.split(',') : 
      ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: process.env.CORS_ALLOWED_HEADERS ? 
      process.env.CORS_ALLOWED_HEADERS.split(',') : 
      ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // ===================
  // CONFIGURACIÓN DE SESIONES
  // ===================
  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'session_secret_CHANGE_IN_PRODUCTION',
    RESAVE: process.env.SESSION_RESAVE === 'true',
    SAVE_UNINITIALIZED: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
    COOKIE: {
      SECURE: process.env.NODE_ENV === 'production',
      HTTP_ONLY: true,
      MAX_AGE: parseInt(process.env.SESSION_MAX_AGE) || 86400000 // 24 horas
    }
  },

  // ===================
  // CONFIGURACIÓN DE LOGS
  // ===================
  LOGS: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    FILE: process.env.LOG_FILE || './logs/app.log',
    ERROR_FILE: process.env.LOG_ERROR_FILE || './logs/error.log',
    COMBINED_FILE: process.env.LOG_COMBINED_FILE || './logs/combined.log'
  },

  // ===================
  // CONFIGURACIÓN DE HELMET (Seguridad)
  // ===================
  HELMET: {
    CONTENT_SECURITY_POLICY: process.env.HELMET_CSP_ENABLED !== 'false',
    HSTS: {
      ENABLED: process.env.HELMET_HSTS_ENABLED !== 'false',
      MAX_AGE: parseInt(process.env.HELMET_HSTS_MAX_AGE) || 31536000, // 1 año
      INCLUDE_SUBDOMAINS: process.env.HELMET_HSTS_INCLUDE_SUBDOMAINS !== 'false'
    }
  },

  // ===================
  // CONFIGURACIÓN DE UPLOADS
  // ===================
  UPLOADS: {
    PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    ALLOWED_EXTENSIONS: process.env.ALLOWED_EXTENSIONS ? 
      process.env.ALLOWED_EXTENSIONS.split(',') : 
      ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  },

  // ===================
  // CONFIGURACIÓN DE EMAIL
  // ===================
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT) || 587,
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@gym-app.com'
  },

  // ===================
  // CONFIGURACIÓN DE VALIDACIÓN
  // ===================
  VALIDATION: {
    PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
    PASSWORD_REQUIRE_UPPERCASE: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    PASSWORD_REQUIRE_LOWERCASE: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    PASSWORD_REQUIRE_NUMBERS: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    PASSWORD_REQUIRE_SYMBOLS: process.env.PASSWORD_REQUIRE_SYMBOLS !== 'false'
  }
};