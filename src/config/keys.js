// src/config/keys.js
module.exports = {
  PORT: process.env.PORT || 3000,
  MODE_ENV: process.env.NODE_ENV || 'development',

  // MySQL
  MySQL: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DATABASE: process.env.DB_NAME || 'gym_db',
    PORT: process.env.DB_PORT || 3306
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
    EXPIRES_IN: '24h'
  }
};