// ============================================================
//  RUTAS RESEÑAS
// ============================================================

const express = require('express');
const path = require('path');
const router = express.Router();

const logger = require('../utils/logger')('Routes/Resenas');
const { readJSON, writeJSON, getNextId } = require('../utils/dataManager');
const { validateResena } = require('../middleware/validation');
const { createResenaLimiter } = require('../middleware/rateLimiter');
const { hasValidAdminKey, requireAdminAuth } = require('../middleware/auth');
const config = require('../config');

const RESENAS_FILE = path.join(config.dataDir, 'resenas.json');

/**
 * POST /api/resenas
 * Crear nueva reseña
 */
router.post(
  '/',
  createResenaLimiter,
  validateResena,
  (req, res) => {
    try {
      const { nombre, ciudad, texto } = req.validatedBody;

      const resenas = readJSON(RESENAS_FILE);
      const resena = {
        id: getNextId(resenas),
        nombre: nombre.trim(),
        ciudad: (ciudad || '').trim(),
        texto: texto.trim(),
        calificacion: 5, // Por defecto 5 estrellas (opcional para future)
        estado: 'pendiente', // pendiente o publicada (para moderar)
        fechaCreacion: new Date().toISOString(),
      };

      resenas.push(resena);
      const success = writeJSON(RESENAS_FILE, resenas);

      if (!success) {
        logger.error('Error al guardar reseña');
        return res.status(500).json({
          error: true,
          message: 'Error al guardar la reseña',
        });
      }

      logger.info('Reseña creada', {
        id: resena.id,
        nombre: resena.nombre,
        ciudad: resena.ciudad,
      });

      res.status(201).json({
        error: false,
        message: 'Reseña creada exitosamente',
        data: resena,
      });
    } catch (error) {
      logger.error('Error al crear reseña', { error: error.message });
      res.status(500).json({
        error: true,
        message: 'Error al procesar la reseña',
      });
    }
  },
);

/**
 * GET /api/resenas
 * Obtener reseñas (públicas por defecto, todas si ?all=true)
 */
router.get('/', (req, res) => {
  try {
    const resenas = readJSON(RESENAS_FILE);
    const showAll = req.query.all === 'true'; // ?all=true para admin

    if (showAll) {
      if (!hasValidAdminKey(req)) {
        return res.status(401).json({
          error: true,
          message: 'No autorizado. API key inválida o ausente.',
        });
      }

      const sortedAll = resenas.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion),
      );

      return res.json({
        error: false,
        data: sortedAll,
        total: sortedAll.length,
        pendientes: sortedAll.filter(r => r.estado === 'pendiente').length,
      });
    }

    const filtered = resenas.filter(r => r.estado === 'publicada');

    const sorted = filtered.sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion),
    );

    res.json({
      error: false,
      data: sorted,
      total: sorted.length,
    });
  } catch (error) {
    logger.error('Error al obtener reseñas', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al obtener las reseñas',
    });
  }
});

/**
 * GET /api/resenas/todas (privado)
 * Obtener TODAS las reseñas (incluyendo pendientes)
 */
router.get('/todas', requireAdminAuth, (req, res) => {
  try {
    const resenas = readJSON(RESENAS_FILE);
    const sorted = resenas.sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion),
    );

    res.json({
      error: false,
      data: sorted,
      total: sorted.length,
      pendientes: sorted.filter(r => r.estado === 'pendiente').length,
    });
  } catch (error) {
    logger.error('Error al obtener todas las reseñas', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al obtener las reseñas',
    });
  }
});

/**
 * GET /api/resenas/:id
 * Obtener una reseña específica
 */
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const resenas = readJSON(RESENAS_FILE);
    const resena = resenas.find(r => r.id === id);

    if (!resena) {
      return res.status(404).json({
        error: true,
        message: 'Reseña no encontrada',
      });
    }

    res.json({
      error: false,
      data: resena,
    });
  } catch (error) {
    logger.error('Error al obtener reseña', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al obtener la reseña',
    });
  }
});

/**
 * PATCH /api/resenas/:id
 * Actualizar estado de una reseña (publicar/rechazar)
 */
router.patch('/:id', requireAdminAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!['publicada', 'rechazada', 'pendiente'].includes(estado)) {
      return res.status(400).json({
        error: true,
        message: 'Estado inválido. Usa: publicada, rechazada o pendiente',
      });
    }

    const resenas = readJSON(RESENAS_FILE);
    const resena = resenas.find(r => r.id === id);

    if (!resena) {
      return res.status(404).json({
        error: true,
        message: 'Reseña no encontrada',
      });
    }

    resena.estado = estado;
    resena.fechaActualizacion = new Date().toISOString();

    const success = writeJSON(RESENAS_FILE, resenas);

    if (!success) {
      logger.error('Error al actualizar reseña');
      return res.status(500).json({
        error: true,
        message: 'Error al actualizar la reseña',
      });
    }

    logger.info('Reseña actualizada', {
      id: resena.id,
      estado: estado,
    });

    res.json({
      error: false,
      message: 'Reseña actualizada exitosamente',
      data: resena,
    });
  } catch (error) {
    logger.error('Error al actualizar reseña', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al actualizar la reseña',
    });
  }
});

/**
 * DELETE /api/resenas/:id
 * Eliminar una reseña
 */
router.delete('/:id', requireAdminAuth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const resenas = readJSON(RESENAS_FILE);
    const index = resenas.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: true,
        message: 'Reseña no encontrada',
      });
    }

    const [resenaEliminada] = resenas.splice(index, 1);
    const success = writeJSON(RESENAS_FILE, resenas);

    if (!success) {
      logger.error('Error al eliminar reseña');
      return res.status(500).json({
        error: true,
        message: 'Error al eliminar la reseña',
      });
    }

    logger.info('Reseña eliminada', {
      id: resenaEliminada.id,
      nombre: resenaEliminada.nombre,
    });

    res.json({
      error: false,
      message: 'Reseña eliminada exitosamente',
    });
  } catch (error) {
    logger.error('Error al eliminar reseña', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al eliminar la reseña',
    });
  }
});

module.exports = router;
