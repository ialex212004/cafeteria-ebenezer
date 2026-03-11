import { NextResponse } from 'next/server';
import config from '../../../src/config/index.js';
import { query } from '../../../src/db/index.js';
import requestIdUtils from '../../../src/utils/requestId.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { createRequestId } = requestIdUtils;

function jsonWithRequestId(payload, init, requestId) {
  const response = NextResponse.json(payload, init);
  response.headers.set('X-Request-Id', requestId);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

async function checkDb(timeoutMs = 1000) {
  const start = Date.now();
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('DB timeout'));
    }, timeoutMs);
  });

  try {
    await Promise.race([query('select 1'), timeout]);
    return { ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return { ok: false, latencyMs: Date.now() - start, error: error.message };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function GET() {
  const requestId = createRequestId();
  const db = await checkDb();

  if (!db.ok) {
    return jsonWithRequestId(
      {
        error: true,
        message: 'Dependencias no disponibles',
        timestamp: new Date().toISOString(),
        environment: config.env,
        uptime: process.uptime(),
        db,
        requestId,
      },
      { status: 503 },
      requestId,
    );
  }

  return jsonWithRequestId(
    {
      error: false,
      message: 'Servidor operativo',
      timestamp: new Date().toISOString(),
      environment: config.env,
      uptime: process.uptime(),
      db,
      requestId,
    },
    undefined,
    requestId,
  );
}
