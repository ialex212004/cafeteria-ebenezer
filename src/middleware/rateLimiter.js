// ============================================================
//  MIDDLEWARE RATE LIMITING
// ============================================================

const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger')('RateLimit');

/**
 * Rate limiter general para la API
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
  standardHeaders: true, // Retorna info en headers RateLimit-*
  legacyHeaders: false, // Deshabilita headers X-RateLimit-*
  skip: (_req) => {
    // Saltar rate limit en desarrollo
    return config.isDev;
  },
  handler: (req, res) => {
    logger.warn('Rate limit excedido', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      error: true,
      message: 'Límite de solicitudes excedido. Por favor, intenta más tarde.',
    });
  },
});

/**
 * Rate limiter específico para creación de pedidos
 */
const createPedidoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: config.limits.maxPedidosPerMinuto,
  skip: (_req) => config.isDev,
  handler: (_req, res) => {
    logger.warn('Rate limit pedidos excedido', { ip: _req.ip });
    res.status(429).json({
      error: true,
      message: 'Demasiados pedidos. Intenta en un momento.',
    });
  },
});

/**
 * Rate limiter específico para creación de reseñas
 */
const createResenaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: config.limits.maxReseniasPerMinuto,
  skip: (_req) => config.isDev,
  handler: (_req, res) => {
    logger.warn('Rate limit reseñas excedido', { ip: _req.ip });
    res.status(429).json({
      error: true,
      message: 'Demasiadas reseñas. Intenta en un momento.',
    });
  },
});

module.exports = {
  apiLimiter,
  createPedidoLimiter,
  createResenaLimiter,
};
