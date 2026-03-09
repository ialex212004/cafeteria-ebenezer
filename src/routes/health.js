// ============================================================
//  RUTAS GENERALES / HEALTH
// ============================================================

const express = require('express');
const router = express.Router();
const config = require('../config');

/**
 * GET /api/health
 * Health check del servidor
 */
router.get('/health', (_req, res) => {
  res.json({
    error: false,
    message: 'Servidor operativo',
    timestamp: new Date().toISOString(),
    environment: config.env,
    uptime: process.uptime(),
  });
});

/**
 * GET /
 * Información del API
 */
router.get('/', (req, res) => {
  res.json({
    error: false,
    name: 'Cafetería Ebenezer API',
    version: '1.0.0',
    environment: config.env,
    endpoints: {
      health: '/api/health',
      pedidos: {
        create: 'POST /api/pedidos',
        getAll: 'GET /api/pedidos',
        getOne: 'GET /api/pedidos/:id',
        update: 'PATCH /api/pedidos/:id',
        delete: 'DELETE /api/pedidos/:id',
      },
      resenas: {
        create: 'POST /api/resenas',
        getPublic: 'GET /api/resenas',
        getAll: 'GET /api/resenas/todas',
        getOne: 'GET /api/resenas/:id',
        update: 'PATCH /api/resenas/:id',
        delete: 'DELETE /api/resenas/:id',
      },
    },
  });
});

module.exports = router;
