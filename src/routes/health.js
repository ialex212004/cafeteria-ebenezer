// ============================================================
//  RUTAS GENERALES / HEALTH
// ============================================================

const express = require('express');
const router = express.Router();
const config = require('../config');
const { query } = require('../db');

async function checkDb() {
  const start = Date.now();
  try {
    await query('select 1');
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return { ok: false, latencyMs: Date.now() - start, error: error.message };
  }
}

/**
 * GET /api/health
 * Health check del servidor
 */
router.get('/health', async (req, res) => {
  const db = await checkDb();
  res.setHeader('Cache-Control', 'no-store');

  if (!db.ok) {
    return res.status(503).json({
      error: true,
      message: 'Dependencias no disponibles',
      timestamp: new Date().toISOString(),
      environment: config.env,
      uptime: process.uptime(),
      db,
      requestId: req.requestId,
    });
  }

  return res.json({
    error: false,
    message: 'Servidor operativo',
    timestamp: new Date().toISOString(),
    environment: config.env,
    uptime: process.uptime(),
    db,
    requestId: req.requestId,
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
