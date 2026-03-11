// ============================================================
//  DB CLIENT (PostgreSQL - node-postgres)
// ============================================================

const { Pool } = require('pg');
const logger = require('./logger')('DB');

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const sslEnabled =
  process.env.DB_SSL === 'true' ||
  (process.env.DB_SSL !== 'false' && process.env.NODE_ENV === 'production');

const pool = new Pool({
  connectionString: hasConnectionString ? process.env.DATABASE_URL : undefined,
  host: hasConnectionString ? undefined : process.env.DB_HOST,
  port: hasConnectionString ? undefined : parseInt(process.env.DB_PORT || '5432', 10),
  database: hasConnectionString ? undefined : process.env.DB_NAME,
  user: hasConnectionString ? undefined : process.env.DB_USER,
  password: hasConnectionString ? undefined : process.env.DB_PASSWORD,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '10000', 10),
});

pool.on('error', (err) => {
  logger.error('Unexpected DB pool error', { error: err.message });
});

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
