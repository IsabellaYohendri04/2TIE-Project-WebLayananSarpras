const mysql = require("mysql2/promise");

function env(name, fallback) {
  return process.env[name] ?? fallback;
}

let pool = null;

function getDbConfig(withDatabase = true) {
  const config = {
    host: env("DB_HOST", "localhost"),
    port: Number(env("DB_PORT", 3306)),
    user: env("DB_USER", "root"),
    password: env("DB_PASSWORD", ""),
    waitForConnections: true,
    connectionLimit: 10,
  };

  if (withDatabase) {
    config.database = env("DB_NAME", "sarpras_db");
  }

  return config;
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig(true));
  }
  return pool;
}

async function testConnection() {
  const connection = await getPool().getConnection();
  connection.release();
}

module.exports = {
  getPool,
  getDbConfig,
  testConnection,
};
