// ============================================================
//  CAFETERÍA EBENEZER — Vercel Serverless Backend
//  Node.js / Express (Serverless Function)
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');

// Cargar configuración y utilidades
const config = require('../src/config');
const logger = require('../src/utils/logger')('Vercel-Server');

// Middleware
const { cors, securityHeaders, requestLogger } = require('../src/middleware/security');
const { apiLimiter } = require('../src/middleware/rateLimiter');
const { errorHandler, notFound } = require('../src/middleware/errorHandler');

// Rutas
const healthRoutes = require('../src/routes/health');
const pedidosRoutes = require('../src/routes/pedidos');
const reseniasRoutes = require('../src/routes/resenas');

// Inicializar Express
const app = express();

// ── MIDDLEWARES GLOBALES ──────────────────────────────────
app.use(securityHeaders);
app.use(cors);
app.use(requestLogger);
app.use(express.json({ limit: config.maxJsonSize }));
app.use(express.urlencoded({ limit: config.maxRequestBodySize, extended: true }));

// Asegurar que existen los directorios requeridos
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
  logger.info(`Directorio de datos creado: ${config.dataDir}`);
}

// ── RATE LIMITING ─────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── RUTAS DE API ──────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/resenas', reseniasRoutes);

// ── MANEJO DE ERRORES ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── EXPORTAR PARA VERCEL ──────────────────────────────────
module.exports = app;

// ── PARA DESARROLLO LOCAL ──────────────────────────────────
// Descomenta para npm run dev
/*
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info('🚀 Servidor local iniciado', {
      puerto: PORT,
      entorno: config.env,
      url: `http://localhost:${PORT}`,
    });
  });
}
*/
