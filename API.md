# 📚 Documentación de API — Cafetería Ebenezer

Referencia completa de endpoints y especificaciones.

## Base URL

```
http://localhost:3000      (Desarrollo)
https://cafeteria-ebenezer.com (Producción)
```

## Headers Requeridos

Todos los requests deben incluir:

```
Content-Type: application/json
```

Requerido en endpoints administrativos:

```
X-API-Key: <API_KEY>
```

## Formato de Respuestas

### Respuesta Exitosa (2xx)

```json
{
  "error": false,
  "message": "Operación exitosa",
  "data": { /* ... */ },
  "total": 1
}
```

### Respuesta de Error (4xx, 5xx)

```json
{
  "error": true,
  "message": "Descripción del error",
  "details": ["Error field1", "Error field2"]
}
```

---

## 🔥 Endpoints Principales

### Health Check

#### GET /api/health

Verifica que el servidor está operativo.

**Response (200)**

```json
{
  "error": false,
  "message": "Servidor operativo",
  "timestamp": "2026-03-09T10:30:00Z",
  "environment": "production",
  "uptime": 3600
}
```

---

### Pedidos

#### POST /api/pedidos

Crear nuevo pedido.

**Request Body**

```json
{
  "nombre": "Juan Pérez",
  "telefono": "+34 123 456 789",
  "producto": "Bocadillo Cubano",
  "cantidad": 2,
  "notas": "Sin mayonesa"
}
```

**Response (201 - Created)**

```json
{
  "error": false,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "telefono": "+34 123 456 789",
    "producto": "Bocadillo Cubano",
    "cantidad": 2,
    "notas": "Sin mayonesa",
    "estado": "pendiente",
    "fechaCreacion": "2026-03-09T10:30:00Z",
    "fechaActualizacion": "2026-03-09T10:30:00Z"
  }
}
```

**Status Codes**

- `201` - Pedido creado
- `400` - Datos inválidos
- `429` - Límite de solicitudes excedido

---

#### GET /api/pedidos

Obtener todos los pedidos (más recientes primero).
**⚠️ Administrativo (requiere `X-API-Key`)**

**Query Parameters**

- Ninguno actualmente

**Response (200)**

```json
{
  "error": false,
  "data": [
    {
      "id": 2,
      "nombre": "María López",
      "producto": "Café con Croissant",
      "cantidad": 1,
      "estado": "confirmado",
      "fechaCreacion": "2026-03-09T11:00:00Z"
    },
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "producto": "Bocadillo Cubano",
      "cantidad": 2,
      "estado": "pendiente",
      "fechaCreacion": "2026-03-09T10:30:00Z"
    }
  ],
  "total": 2
}
```

---

#### GET /api/pedidos/:id

Obtener un pedido específico.
**⚠️ Administrativo (requiere `X-API-Key`)**

**Path Parameters**

- `id` (number) - ID del pedido

**Response (200)**

```json
{
  "error": false,
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "telefono": "+34 123 456 789",
    "producto": "Bocadillo Cubano",
    "cantidad": 2,
    "estado": "pendiente",
    "fechaCreacion": "2026-03-09T10:30:00Z",
    "fechaActualizacion": "2026-03-09T10:30:00Z"
  }
}
```

**Status Codes**

- `200` - Pedido encontrado
- `404` - Pedido no encontrado
- `401` - No autorizado

---

#### PATCH /api/pedidos/:id

Actualizar estado de un pedido.
**⚠️ Administrativo (requiere `X-API-Key`)**

**Path Parameters**

- `id` (number) - ID del pedido

**Request Body**

```json
{
  "estado": "confirmado"
}
```

**Estados Válidos**

- `pendiente` - Nuevo pedido
- `confirmado` - Confirmado por cafetería
- `entregado` - Entregado al cliente

**Response (200)**

```json
{
  "error": false,
  "message": "Pedido actualizado exitosamente",
  "data": {
    "id": 1,
    "estado": "confirmado",
    "fechaActualizacion": "2026-03-09T10:35:00Z"
  }
}
```

---

#### DELETE /api/pedidos/:id

Eliminar un pedido.
**⚠️ Administrativo (requiere `X-API-Key`)**

**Path Parameters**

- `id` (number) - ID del pedido

**Response (200)**

```json
{
  "error": false,
  "message": "Pedido eliminado exitosamente"
}
```

---

### Reseñas

#### POST /api/resenas

Crear nueva reseña.

**Request Body**

```json
{
  "nombre": "María López",
  "ciudad": "Madrid",
  "texto": "Los bocadillos son deliciosos. Recomiendo mucho esta cafetería. El servicio fue excelente."
}
```

**Validaciones**

- `nombre` - Requerido, máx 100 caracteres
- `ciudad` - Opcional, máx 100 caracteres
- `texto` - Requerido, 5-1000 caracteres

**Response (201 - Created)**

```json
{
  "error": false,
  "message": "Reseña creada exitosamente",
  "data": {
    "id": 1,
    "nombre": "María López",
    "ciudad": "Madrid",
    "texto": "Los bocadillos son deliciosos...",
    "estado": "pendiente",
    "fechaCreacion": "2026-03-09T11:00:00Z"
  }
}
```

---

#### GET /api/resenas

Obtener reseñas publicadas (públicas).
Para incluir pendientes/rechazadas, usar `GET /api/resenas?all=true` con `X-API-Key`.

**Response (200)**

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "nombre": "María López",
      "ciudad": "Madrid",
      "texto": "Excelente café y ambiente.",
      "estado": "publicada",
      "fechaCreacion": "2026-03-09T11:00:00Z"
    }
  ],
  "total": 1
}
```

---

#### GET /api/resenas/todas

**⚠️ Administrativo**

Obtener todas las reseñas (incluyendo pendientes y rechazadas).
Requiere `X-API-Key`.

**Response (200)**

```json
{
  "error": false,
  "data": [
    {
      "id": 2,
      "nombre": "Juan García",
      "ciudad": "Barcelona",
      "texto": "Buena atención pero café tibio.",
      "estado": "pendiente",
      "fechaCreacion": "2026-03-09T12:00:00Z"
    },
    {
      "id": 1,
      "nombre": "María López",
      "city": "Madrid",
      "estado": "publicada"
    }
  ],
  "total": 2,
  "pendientes": 1
}
```

---

#### PATCH /api/resenas/:id

Cambiar estado de una reseña (publicar/rechazar).
**⚠️ Administrativo (requiere `X-API-Key`)**

**Path Parameters**

- `id` (number) - ID de la reseña

**Request Body**

```json
{
  "estado": "publicada"
}
```

**Estados Válidos**

- `publicada` - Mostrar en web
- `rechazada` - No mostrar
- `pendiente` -Espera moderación

**Response (200)**

```json
{
  "error": false,
  "message": "Reseña actualizada exitosamente",
  "data": {
    "id": 1,
    "estado": "publicada",
    "fechaActualizacion": "2026-03-09T11:05:00Z"
  }
}
```

---

#### DELETE /api/resenas/:id

Eliminar una reseña.

**Path Parameters**

- `id` (number) - ID de la reseña

**Response (200)**

```json
{
  "error": false,
  "message": "Reseña eliminada exitosamente"
}
```

---

## ⚠️ Códigos de Error

| Código | Significado | Solución |
|--------|------------|----------|
| 400 | Bad Request | Verifica los datos enviados |
| 404 | Not Found | El recurso no existe |
| 429 | Too Many Requests | Espera antes de hacer nuevas solicitudes |
| 500 | Internal Server Error | Error del servidor, contacta soporte |

---

## 🔄 Exemplos con CURL

### Crear Pedido

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "telefono": "+34 123 456 789",
    "producto": "Bocadillo Cubano",
    "cantidad": 2
  }'
```

### Obtener Todos Los Pedidos

```bash
curl http://localhost:3000/api/pedidos
```

### Actualizar Estado de Pedido

```bash
curl -X PATCH http://localhost:3000/api/pedidos/1 \
  -H "Content-Type: application/json" \
  -d '{"estado": "confirmado"}'
```

### Crear Reseña

```bash
curl -X POST http://localhost:3000/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María López",
    "ciudad": "Madrid",
    "texto": "Excelente servicio y delicioso café."
  }'
```

---

## 📋 Notas Importantes

1. **Rate Limiting**: Se permite máximo 100 requests por 15 minutos
2. **Timestamps**: Están en formato ISO 8601 (UTC)
3. **IDs**: Son números únicos autoincremantales
4. **Datos**: Se guardan en archivos JSON (uso local) o DB (producción)
5. **Errores**: Siempre incluyen `error: true` y descripción

---

*Última actualización: Marzo 2026*
