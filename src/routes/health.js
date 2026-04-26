// ============================================================
//  RUTAS GENERALES / HEALTH
// ============================================================

const express = require('express');
const router = express.Router();
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
      requestId: req.requestId,
    });
  }

  return res.json({
    error: false,
    message: 'ok',
    requestId: req.requestId,
  });
});

router.get('/', (_req, res) => {
  res.json({
    error: false,
    name: 'Cafetería Ébenezer API',
    version: '1.0.0',
  });
});

module.exports = router;
