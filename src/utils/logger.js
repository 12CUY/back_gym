const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;
const path = require('path');
const fs = require('fs');

// Crear directorio logs si no existe
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configuración de niveles y colores
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    sql: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    sql: 'blue',
    debug: 'gray'
  }
};

// Formato personalizado
const logFormat = printf(({ level, message, timestamp, stack, durationMs }) => {
  const baseLog = `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  return durationMs ? `${baseLog} (${durationMs}ms)` : baseLog;
});

// Crear logger principal
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Transporte único para todos los logs
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat
      )
    }),
    
    // Consola con colores (solo en desarrollo)
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: combine(
          colorize({ all: true }),
          logFormat
        )
      })
    ] : [])
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'app.log')
    })
  ]
});

// Añadir colores
winston.addColors(customLevels.colors);

// Método especial para SQL
logger.sql = function(message, duration) {
  this.log({
    level: 'sql',
    message: `SQL: ${message}`,
    durationMs: duration
  });
};

// Stream para Morgan
logger.stream = {
  write: (message) => logger.info(`HTTP: ${message.trim()}`)
};

module.exports = logger;