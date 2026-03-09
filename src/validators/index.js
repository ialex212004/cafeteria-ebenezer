// ============================================================
//  ESQUEMAS DE VALIDACIÓN
// ============================================================

const Joi = require('joi');
const config = require('../config');
const { limits } = config;

/**
 * Esquema para validación de pedidos
 */
const pedidoSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(limits.maxLengthNombre)
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.max': `El nombre no debe exceder ${limits.maxLengthNombre} caracteres`,
    }),

  telefono: Joi.string()
    .trim()
    .required()
    .pattern(/^[\d\s+\-()]+$/)
    .max(limits.maxLengthTelefono)
    .messages({
      'string.empty': 'El teléfono es requerido',
      'string.pattern.base': 'Formato de teléfono inválido',
      'string.max': `El teléfono no debe exceder ${limits.maxLengthTelefono} caracteres`,
    }),

  producto: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(limits.maxLengthProducto)
    .messages({
      'string.empty': 'El producto es requerido',
      'string.max': `El producto no debe exceder ${limits.maxLengthProducto} caracteres`,
    }),

  cantidad: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(1)
    .messages({
      'number.min': 'La cantidad debe ser mínimo 1',
      'number.max': 'La cantidad no debe exceder 100',
    }),

  notas: Joi.string()
    .trim()
    .max(limits.maxLengthNotas)
    .allow('')
    .messages({
      'string.max': `Las notas no deben exceder ${limits.maxLengthNotas} caracteres`,
    }),
});

/**
 * Esquema para actualización de estado de pedido
 */
const actualizarPedidoSchema = Joi.object({
  estado: Joi.string()
    .required()
    .valid('pendiente', 'confirmado', 'entregado')
    .messages({
      'any.only': 'El estado debe ser: pendiente, confirmado o entregado',
    }),
});

/**
 * Esquema para validación de reseñas
 */
const resenaSchema = Joi.object({
  nombre: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(limits.maxLengthNombre)
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.max': `El nombre no debe exceder ${limits.maxLengthNombre} caracteres`,
    }),

  ciudad: Joi.string()
    .trim()
    .max(limits.maxLengthCiudad)
    .allow('')
    .messages({
      'string.max': `La ciudad no debe exceder ${limits.maxLengthCiudad} caracteres`,
    }),

  texto: Joi.string()
    .trim()
    .required()
    .min(5)
    .max(limits.maxLengthResenia)
    .messages({
      'string.empty': 'La reseña es requerida',
      'string.min': 'La reseña debe tener al menos 5 caracteres',
      'string.max': `La reseña no debe exceder ${limits.maxLengthResenia} caracteres`,
    }),
});

/**
 * Wrapper para validación
 * @param {object} schema - Esquema de Joi
 * @param {object} data - Datos a validar
 * @returns {object} { valid: boolean, value: *, error: * }
 */
function validate(schema, data) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    return {
      valid: false,
      value: null,
      error: messages,
    };
  }

  return {
    valid: true,
    value,
    error: null,
  };
}

module.exports = {
  validate,
  schemas: {
    pedido: pedidoSchema,
    actualizarPedido: actualizarPedidoSchema,
    resena: resenaSchema,
  },
};
