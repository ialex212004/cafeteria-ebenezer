// ============================================================
//  PostgreSQL Pool (node-postgres)
// ============================================================

const { Pool } = require('pg');
const config = require('../config');
const logger = require('../utils/logger')('DB');

const connectionString = process.env.DATABASE_URL;
const isVercel = Boolean(process.env.VERCEL);
const useSsl =
  process.env.DB_SSL === 'true' ||
  process.env.PGSSLMODE === 'require' ||
  (config.isProduction && (isVercel || connectionString || process.env.DB_HOST));

const pool = new Pool({
  connectionString: connectionString || undefined,
  host: connectionString ? undefined : process.env.DB_HOST,
  port: connectionString
    ? undefined
    : parseInt(process.env.DB_PORT || '5432', 10),
  database: connectionString ? undefined : process.env.DB_NAME,
  user: connectionString ? undefined : process.env.DB_USER,
  password: connectionString ? undefined : process.env.DB_PASSWORD,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('DB pool error', { error: err.message });
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
