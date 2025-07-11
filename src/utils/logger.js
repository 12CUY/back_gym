const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;
const path = require('path');
const fs = require('fs');
const util = require('util');

// Crear directorio logs si no existe
const logDir = path.resolve(__dirname, '../../logs');
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true, mode: 0o755 });
  }
} catch (err) {
  console.error('No se pudo crear el directorio de logs:', err);
  process.exit(1);
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

// Función para manejar objetos circulares
const safeStringify = (obj, indent = 2) => {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Eliminar referencia circular
        return '[Circular]';
      }
      cache.add(value);
    }
    return value;
  }, indent);
};

// Formateador mejorado que maneja objetos circulares
const logFormat = printf(({ level, message, timestamp, stack, durationMs, ...meta }) => {
  const metadata = Object.keys(meta).length > 0 ? 
    safeStringify(meta, null) : '';
  
  let msg = `${timestamp} [${level.toUpperCase()}]`;
  
  if (typeof message === 'object') {
    msg += `: ${safeStringify(message)}`;
  } else {
    msg += `: ${message}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  if (durationMs) {
    msg += ` (${durationMs}ms)`;
  }
  
  if (metadata) {
    msg += `\n${metadata}`;
  }
  
  return msg;
});

// Crear logger principal
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      format: combine(
        timestamp(),
        logFormat
      )
    }),
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

// Método especial para SQL que evita pasar la instancia completa de Sequelize
logger.sql = function(message, duration, meta = {}) {
  const safeMeta = { ...meta };
  
  // Eliminar propiedades problemáticas de Sequelize si existen
  if (safeMeta.sequelize) {
    safeMeta.sequelize = {
      config: {
        database: safeMeta.sequelize.config.database,
        host: safeMeta.sequelize.config.host,
        port: safeMeta.sequelize.config.port
      },
      options: {
        dialect: safeMeta.sequelize.options.dialect
      }
    };
  }
  
  this.log({
    level: 'sql',
    message: typeof message === 'string' ? message : 'SQL Query',
    durationMs: duration,
    ...safeMeta
  });
};

// Stream para Morgan
logger.stream = {
  write: (message) => logger.info(message.trim(), { context: 'HTTP' })
};

module.exports = logger;