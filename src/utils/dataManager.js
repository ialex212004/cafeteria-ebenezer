// ============================================================
//  UTILIDADES PARA DATOS JSON
// ============================================================

const fs = require('fs');
const path = require('path');
const logger = require('./logger')('DataManager');
const config = require('../config');

/**
 * Lee un archivo JSON de manera segura
 * @param {string} filePath - Ruta al archivo JSON
 * @returns {Array} Contenido del archivo o array vacío
 */
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      logger.warn(`Archivo no encontrado, creando nuevo: ${filePath}`);
      writeJSON(filePath, []);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error al leer ${filePath}:`, { error: error.message });
    return [];
  }
}

/**
 * Escribe datos en un archivo JSON
 * @param {string} filePath - Ruta al archivo JSON
 * @param {*} data - Datos a escribir
 * @returns {boolean} Éxito de la operación
 */
function writeJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    logger.error(`Error al escribir ${filePath}:`, { error: error.message });
    return false;
  }
}

/**
 * Obtiene el siguiente ID disponible para una colección
 * @param {Array} items - Array de items
 * @returns {number} Siguiente ID
 */
function getNextId(items = []) {
  if (items.length === 0) {
    return 1;
  }
  const maxId = Math.max(...items.map(item => item.id || 0));
  return maxId + 1;
}

/**
 * Ejecución segura de operaciones con archivo
 * @param {string} type - 'pedidos' o 'resenas'
 * @param {Function} callback - Función a ejecutar
 * @returns {*} Resultado del callback
 */
function withDataFile(type, callback) {
  const filePath = path.join(config.dataDir, `${type}.json`);
  try {
    return callback(filePath);
  } catch (error) {
    logger.error(`Error en operación de ${type}:`, { error: error.message });
    throw error;
  }
}

module.exports = {
  readJSON,
  writeJSON,
  getNextId,
  withDataFile,
};
