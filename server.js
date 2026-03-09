// ============================================================
//  CAFETERÍA EBENEZER — Backend Profesional
//  Node.js / Express + Validación + Logging
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');

// Cargar configuración y utilidades
const config = require('./src/config');
const logger = require('./src/utils/logger')('Server');

// Middleware
const { cors, securityHeaders, requestLogger } = require('./src/middleware/security');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Rutas
const healthRoutes = require('./src/routes/health');
const pedidosRoutes = require('./src/routes/pedidos');
const reseniasRoutes = require('./src/routes/resenas');

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
if (!fs.existsSync(config.logsDir)) {
  fs.mkdirSync(config.logsDir, { recursive: true });
}

// ── ARCHIVOS ESTÁTICOS ────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── RATE LIMITING ─────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── RUTAS DE API ──────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/resenas', reseniasRoutes);

// ── FALLBACK SPA (Serve index.html para rutas no reconocidas) ─
app.get('*', (req, res) => {
  // Si es un archivo estático, Express ya lo servió
  // Si no, es una ruta del SPA, servimos index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── MANEJO DE ERRORES ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── INICIAR SERVIDOR ──────────────────────────────────────
const server = app.listen(config.port, config.host, () => {
  logger.info('🚀 Servidor iniciado', {
    puerto: config.port,
    entorno: config.env,
    url: `http://${config.host}:${config.port}`,
  });
});

// ── MANEJO DE ERRORES NO CAPTURADOS ───────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason.message || String(reason),
    promise,
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// ── GRACEFUL SHUTDOWN ─────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor gracefully...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido. Cerrando servidor gracefully...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;
