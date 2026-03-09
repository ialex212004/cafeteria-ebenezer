// ============================================================
//  MIDDLEWARE AUTENTICACIÓN (ADMIN)
// ============================================================

const config = require('../config');
const logger = require('../utils/logger')('Auth');

/**
 * Extrae API key desde header x-api-key o Authorization: Bearer <token>
 * @param {import('express').Request} req
 * @returns {string}
 */
function getApiKeyFromRequest(req) {
  const directKey = req.headers['x-api-key'];
  if (typeof directKey === 'string' && directKey.trim()) {
    return directKey.trim();
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return '';
}

function hasValidAdminKey(req) {
  const providedKey = getApiKeyFromRequest(req);
  return Boolean(providedKey && providedKey === config.apiKey);
}

/**
 * Protege endpoints administrativos con API_KEY de entorno.
 */
function requireAdminAuth(req, res, next) {
  if (!hasValidAdminKey(req)) {
    logger.warn('Acceso admin denegado', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    return res.status(401).json({
      error: true,
      message: 'No autorizado. API key inválida o ausente.',
    });
  }

  next();
}

module.exports = {
  hasValidAdminKey,
  requireAdminAuth,
};
