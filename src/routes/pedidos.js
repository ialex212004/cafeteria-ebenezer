// ============================================================
//  RUTAS PEDIDOS
// ============================================================

const express = require('express');
const path = require('path');
const router = express.Router();

const logger = require('../utils/logger')('Routes/Pedidos');
const { readJSON, writeJSON, getNextId } = require('../utils/dataManager');
const { validatePedido, validateActualizarPedido } = require('../middleware/validation');
const { createPedidoLimiter } = require('../middleware/rateLimiter');
const config = require('../config');

const PEDIDOS_FILE = path.join(config.dataDir, 'pedidos.json');

/**
 * POST /api/pedidos
 * Crear nuevo pedido
 */
router.post(
  '/',
  createPedidoLimiter,
  validatePedido,
  (req, res) => {
    try {
      const { nombre, telefono, producto, cantidad, notas } = req.validatedBody;

      const pedidos = readJSON(PEDIDOS_FILE);

      // Validación: No permitir 2 pedidos activos del mismo teléfono
      const pedidoActivo = pedidos.find(
        p =>
          p.telefono === telefono &&
          ['pendiente', 'confirmado'].includes(p.estado),
      );

      if (pedidoActivo) {
        logger.warn('Intento de duplicado', {
          telefono,
          pedidoExistente: pedidoActivo.id,
        });
        return res.status(409).json({
          error: true,
          message: 'Ya existe un pedido activo con este teléfono',
          conflictId: pedidoActivo.id,
        });
      }

      const pedido = {
        id: getNextId(pedidos),
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        producto: producto.trim(),
        cantidad: cantidad || 1,
        notas: (notas || '').trim(),
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };

      pedidos.push(pedido);
      const success = writeJSON(PEDIDOS_FILE, pedidos);

      if (!success) {
        logger.error('Error al guardar pedido');
        return res.status(500).json({
          error: true,
          message: 'Error al guardar el pedido',
        });
      }

      logger.info('Pedido creado', {
        id: pedido.id,
        nombre: pedido.nombre,
        producto: pedido.producto,
      });

      res.status(201).json({
        error: false,
        message: 'Pedido creado exitosamente',
        data: pedido,
      });
    } catch (error) {
      logger.error('Error al crear pedido', { error: error.message });
      res.status(500).json({
        error: true,
        message: 'Error al procesar el pedido',
      });
    }
  },
);

/**
 * GET /api/pedidos
 * Obtener todos los pedidos (más recientes primero)
 * Query: ?estado=pendiente|confirmado|entregado para filtrar
 * Query: ?limit=10&page=1 para paginación
 */
router.get('/', (req, res) => {
  try {
    let pedidos = readJSON(PEDIDOS_FILE);

    // Filtrar por estado si se proporciona
    if (req.query.estado) {
      const estadoFiltro = req.query.estado.toLowerCase();
      const estadosValidos = ['pendiente', 'confirmado', 'entregado'];
      if (estadosValidos.includes(estadoFiltro)) {
        pedidos = pedidos.filter(p => p.estado === estadoFiltro);
      } else {
        return res.status(400).json({
          error: true,
          message: `Estado inválido. Usa: ${estadosValidos.join(', ')}`,
        });
      }
    }

    // Ordenar por fecha descendente (más recientes primero)
    const sorted = pedidos.sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion),
    );

    // Paginación básica
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = sorted.slice(start, end);

    res.json({
      error: false,
      data: paginated,
      total: sorted.length,
      page,
      limit,
      pages: Math.ceil(sorted.length / limit),
    });
  } catch (error) {
    logger.error('Error al obtener pedidos', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al obtener los pedidos',
    });
  }
});

/**
 * GET /api/pedidos/:id
 * Obtener un pedido específico
 */
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedidos = readJSON(PEDIDOS_FILE);
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    res.json({
      error: false,
      data: pedido,
    });
  } catch (error) {
    logger.error('Error al obtener pedido', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al obtener el pedido',
    });
  }
});

/**
 * PATCH /api/pedidos/:id
 * Actualizar estado de un pedido
 */
router.patch('/:id', validateActualizarPedido, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.validatedBody;

    const pedidos = readJSON(PEDIDOS_FILE);
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    const estadoAnterior = pedido.estado;
    pedido.estado = estado;
    pedido.fechaActualizacion = new Date().toISOString();

    const success = writeJSON(PEDIDOS_FILE, pedidos);

    if (!success) {
      logger.error('Error al actualizar pedido');
      return res.status(500).json({
        error: true,
        message: 'Error al actualizar el pedido',
      });
    }

    logger.info('Pedido actualizado', {
      id: pedido.id,
      estadoAnterior,
      estadoNuevo: estado,
    });

    res.json({
      error: false,
      message: 'Pedido actualizado exitosamente',
      data: pedido,
    });
  } catch (error) {
    logger.error('Error al actualizar pedido', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al actualizar el pedido',
    });
  }
});

/**
 * DELETE /api/pedidos/:id
 * Eliminar un pedido
 */
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const pedidos = readJSON(PEDIDOS_FILE);
    const index = pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    const [pedidoEliminado] = pedidos.splice(index, 1);
    const success = writeJSON(PEDIDOS_FILE, pedidos);

    if (!success) {
      logger.error('Error al eliminar pedido');
      return res.status(500).json({
        error: true,
        message: 'Error al eliminar el pedido',
      });
    }

    logger.info('Pedido eliminado', {
      id: pedidoEliminado.id,
      nombre: pedidoEliminado.nombre,
    });

    res.json({
      error: false,
      message: 'Pedido eliminado exitosamente',
    });
  } catch (error) {
    logger.error('Error al eliminar pedido', { error: error.message });
    res.status(500).json({
      error: true,
      message: 'Error al eliminar el pedido',
    });
  }
});

module.exports = router;
