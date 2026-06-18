// ============================================================
// db/dbConnect.js
// Reutilizado do projeto base (portaria_novo).
// Responsável por toda comunicação com o banco MariaDB.
// ============================================================

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host:            process.env.DBHOST,
  user:            process.env.DBUSER,
  password:        process.env.DBPASS,
  database:        process.env.DBNAME,
  connectionLimit: 5,
  waitForConnections: true,
});


async function executarQuery(query, params = []) {
  if (process.env.NODE_ENV === "development") {
    console.log("[DB] Query:", query, "| Params:", params);
  }
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    console.error("[DB] Erro ao executar query:", err.message);
    throw err;
  }
}

module.exports = { executarQuery };
