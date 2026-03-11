// ============================================================
//  RUTAS PEDIDOS
// ============================================================

const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')('Routes/Pedidos');
const { query } = require('../db');
const { validatePedido, validateActualizarPedido } = require('../middleware/validation');
const { createPedidoLimiter } = require('../middleware/rateLimiter');
const { requireAdminAuth } = require('../middleware/auth');

function buildPedidoItems({ producto, cantidad, telefono }) {
  return {
    producto,
    cantidad,
    telefono,
  };
}

function normalizeItems(items) {
  if (!items) {
    return {};
  }
  if (Array.isArray(items)) {
    return items[0] || {};
  }
  if (typeof items === 'object') {
    return items;
  }
  try {
    const parsed = JSON.parse(items);
    if (Array.isArray(parsed)) {
      return parsed[0] || {};
    }
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (_error) {
    return {};
  }
  return {};
}

function mapPedido(row) {
  const first = normalizeItems(row.items);
  const createdAt = row.created_at ? new Date(row.created_at).toISOString() : null;

  return {
    id: row.id,
    nombre: row.cliente_nombre || first.nombre || '',
    telefono: first.telefono || '',
    producto: first.producto || '',
    cantidad: first.cantidad || 1,
    notas: row.notas || '',
    estado: row.estado,
    fechaCreacion: createdAt,
    fechaActualizacion: createdAt,
  };
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

/**
 * POST /api/pedidos
 * Crear nuevo pedido
 */
router.post('/', createPedidoLimiter, validatePedido, async (req, res) => {
  try {
    const { nombre, telefono, producto, cantidad, notas } = req.validatedBody;

    const duplicateResult = await query(
      "select id from pedidos where estado = any($1) and (items->>'telefono' = $2 or (items::jsonb -> 0 ->> 'telefono') = $2) limit 1",
      [['pendiente', 'confirmado'], telefono],
    );

    if (duplicateResult.rows.length > 0) {
      const pedidoExistente = duplicateResult.rows[0];
      logger.warn('Intento de duplicado', {
        telefono,
        pedidoExistente: pedidoExistente.id,
      });
      return res.status(409).json({
        error: true,
        message: 'Ya existe un pedido activo con este teléfono',
        conflictId: pedidoExistente.id,
      });
    }

    const items = buildPedidoItems({
      producto: producto.trim(),
      cantidad: cantidad || 1,
      telefono: telefono.trim(),
    });

    const insertResult = await query(
      'insert into pedidos (cliente_nombre, cliente_email, items, total, estado, notas) values ($1, $2, $3, $4, $5, $6) returning *',
      [
        nombre.trim(),
        null,
        JSON.stringify(items),
        0,
        'pendiente',
        (notas || '').trim(),
      ],
    );

    const pedido = mapPedido(insertResult.rows[0]);

    logger.info('Pedido creado', {
      id: pedido.id,
      nombre: pedido.nombre,
      producto: pedido.producto,
    });

    return res.status(201).json({
      error: false,
      message: 'Pedido creado exitosamente',
      data: pedido,
    });
  } catch (error) {
    logger.error('Error al crear pedido', { error: error.message });
    return res.status(500).json({
      error: true,
      message: 'Error al procesar el pedido',
    });
  }
});

/**
 * GET /api/pedidos
 * Obtener todos los pedidos (más recientes primero)
 * Query: ?estado=pendiente|confirmado|entregado para filtrar
 * Query: ?limit=10&page=1 para paginación
 */
router.get('/', requireAdminAuth, async (req, res) => {
  try {
    const estadoFiltro = req.query.estado ? req.query.estado.toLowerCase() : null;
    const estadosValidos = ['pendiente', 'confirmado', 'entregado'];

    if (estadoFiltro && !estadosValidos.includes(estadoFiltro)) {
      return res.status(400).json({
        error: true,
        message: `Estado inválido. Usa: ${estadosValidos.join(', ')}`,
      });
    }

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const offset = (page - 1) * limit;

    let whereClause = '';
    let whereParams = [];
    if (estadoFiltro) {
      whereClause = 'where estado = $1';
      whereParams = [estadoFiltro];
    }

    const countResult = await query(
      `select count(*)::int as total from pedidos ${whereClause}`,
      whereParams,
    );

    const dataParams = estadoFiltro
      ? [estadoFiltro, limit, offset]
      : [limit, offset];
    const dataQuery = estadoFiltro
      ? 'select * from pedidos where estado = $1 order by created_at desc limit $2 offset $3'
      : 'select * from pedidos order by created_at desc limit $1 offset $2';

    const pedidosResult = await query(dataQuery, dataParams);
    const pedidos = pedidosResult.rows.map(mapPedido);

    return res.json({
      error: false,
      data: pedidos,
      total: countResult.rows[0]?.total || 0,
      page,
      limit,
      pages: Math.ceil((countResult.rows[0]?.total || 0) / limit) || 1,
    });
  } catch (error) {
    logger.error('Error al obtener pedidos', { error: error.message });
    return res.status(500).json({
      error: true,
      message: 'Error al obtener los pedidos',
    });
  }
});

/**
 * GET /api/pedidos/:id
 * Obtener un pedido específico
 */
router.get('/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: true,
        message: 'ID inválido',
      });
    }
    const pedidoResult = await query('select * from pedidos where id = $1', [id]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    return res.json({
      error: false,
      data: mapPedido(pedidoResult.rows[0]),
    });
  } catch (error) {
    logger.error('Error al obtener pedido', { error: error.message });
    return res.status(500).json({
      error: true,
      message: 'Error al obtener el pedido',
    });
  }
});

/**
 * PATCH /api/pedidos/:id
 * Actualizar estado de un pedido
 */
router.patch('/:id', requireAdminAuth, validateActualizarPedido, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: true,
        message: 'ID inválido',
      });
    }
    const { estado } = req.validatedBody;

    const updateResult = await query(
      'update pedidos set estado = $1 where id = $2 returning *',
      [estado, id],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    const pedido = mapPedido(updateResult.rows[0]);
    const fechaActualizacion = new Date().toISOString();

    logger.info('Pedido actualizado', {
      id: pedido.id,
      estadoNuevo: estado,
    });

    return res.json({
      error: false,
      message: 'Pedido actualizado exitosamente',
      data: {
        ...pedido,
        fechaActualizacion,
      },
    });
  } catch (error) {
    logger.error('Error al actualizar pedido', { error: error.message });
    return res.status(500).json({
      error: true,
      message: 'Error al actualizar el pedido',
    });
  }
});

/**
 * DELETE /api/pedidos/:id
 * Eliminar un pedido
 */
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({
        error: true,
        message: 'ID inválido',
      });
    }
    const deleteResult = await query('delete from pedidos where id = $1 returning id', [id]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Pedido no encontrado',
      });
    }

    logger.info('Pedido eliminado', {
      id,
    });

    return res.json({
      error: false,
      message: 'Pedido eliminado exitosamente',
    });
  } catch (error) {
    logger.error('Error al eliminar pedido', { error: error.message });
    return res.status(500).json({
      error: true,
      message: 'Error al eliminar el pedido',
    });
  }
});

module.exports = router;
