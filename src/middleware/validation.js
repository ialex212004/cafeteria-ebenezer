// ============================================================
//  MIDDLEWARE VALIDACIÓN
// ============================================================

const validators = require('../validators');
const logger = require('../utils/logger')('Validation');

/**
 * Factory para crear middlewares de validación
 * @param {object} schema - Esquema de Joi
 * @returns {Function} Middleware de Express
 */
const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { valid, value, error } = validators.validate(schema, req.body);

    if (!valid) {
      logger.warn('Validación fallida', {
        path: req.path,
        errors: error,
      });
      return res.status(400).json({
        error: true,
        message: 'Datos inválidos',
        details: error,
      });
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Validar pedido
 */
const validatePedido = createValidationMiddleware(validators.schemas.pedido);

/**
 * Validar actualización de pedido
 */
const validateActualizarPedido = createValidationMiddleware(
  validators.schemas.actualizarPedido,
);

/**
 * Validar reseña
 */
const validateResena = createValidationMiddleware(validators.schemas.resena);

module.exports = {
  validatePedido,
  validateActualizarPedido,
  validateResena,
};
