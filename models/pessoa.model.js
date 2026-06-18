// ============================================================
// models/pessoa.model.js
// ============================================================

const db = require("../db/dbConnect.js");

class Pessoa {

  // Lista apenas pessoas ATIVAS
  static async listarTodas() {
    const query = `
      SELECT id, nome, documento, ativo
      FROM pessoas
      WHERE ativo = 1
      ORDER BY nome ASC
    `;
    return db.executarQuery(query);
  }

  // Lista apenas pessoas INATIVAS
  static async listarInativas() {
    const query = `
      SELECT id, nome, documento, ativo
      FROM pessoas
      WHERE ativo = 0
      ORDER BY nome ASC
    `;
    return db.executarQuery(query);
  }

  static async buscarPorId(id) {
    const query = `
      SELECT id, nome, documento, ativo
      FROM pessoas
      WHERE id = ?
      LIMIT 1
    `;
    const rows = await db.executarQuery(query, [id]);
    return rows[0] || null;
  }

  static async buscarPorDocumento(documento) {
    const query = `
      SELECT id, nome, documento, ativo
      FROM pessoas
      WHERE documento = ?
      LIMIT 1
    `;
    const rows = await db.executarQuery(query, [documento.trim()]);
    return rows[0] || null;
  }

  static async cadastrar(nome, documento) {
    const query = `
      INSERT INTO pessoas (nome, documento, ativo)
      VALUES (?, ?, 1)
    `;
    return db.executarQuery(query, [nome.trim(), documento.trim()]);
  }

  // Desativa a pessoa (não apaga do banco)
  static async desativar(id) {
    const query = `
      UPDATE pessoas SET ativo = 0 WHERE id = ?
    `;
    return db.executarQuery(query, [id]);
  }

  // Reativa a pessoa
  static async reativar(id) {
    const query = `
      UPDATE pessoas SET ativo = 1 WHERE id = ?
    `;
    return db.executarQuery(query, [id]);
  }

  static async possuiAcessos(id) {
    const query = `
      SELECT COUNT(*) AS total
      FROM acessos
      WHERE pessoa_id = ?
    `;
    const rows = await db.executarQuery(query, [id]);
    return Number(rows[0].total) > 0;
  }

  static async deletar(id) {
    const query = `DELETE FROM pessoas WHERE id = ?`;
    return db.executarQuery(query, [id]);
  }
}

module.exports = Pessoa;
