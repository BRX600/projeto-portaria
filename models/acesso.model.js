// ============================================================
// models/acesso.model.js
// Adaptado de veiculo.model.js do projeto base.
// Gerencia o registro de entradas e saídas de pessoas.
//
// Regras de negócio implementadas no model (validações de estado):
//   - Uma pessoa não pode entrar se já estiver dentro (status 'dentro')
//   - Uma pessoa não pode sair se não estiver dentro (status 'dentro')
//   - Cada entrada deve ter saída correspondente (status controla isso)
// ============================================================

const db = require("../db/dbConnect.js");

class Acesso {

  // Verifica se a pessoa está atualmente dentro (acesso ativo)
  static async buscarAtivoporPessoa(pessoaId) {
    const query = `
      SELECT id, pessoa_id, entrada, saida, status
      FROM acessos
      WHERE pessoa_id = ? AND status = 'dentro'
      LIMIT 1
    `;
    const rows = await db.executarQuery(query, [pessoaId]);
    return rows[0] || null;
  }

  // Busca acesso por ID
  static async buscarPorId(id) {
    const query = `
      SELECT a.id, a.pessoa_id, a.entrada, a.saida, a.status,
             p.nome, p.documento
      FROM acessos a
      JOIN pessoas p ON p.id = a.pessoa_id
      WHERE a.id = ?
      LIMIT 1
    `;
    const rows = await db.executarQuery(query, [id]);
    return rows[0] || null;
  }

  // Registra a entrada de uma pessoa (NOW() no banco — sem manipulação manual)
  static async registrarEntrada(pessoaId) {
    const query = `
      INSERT INTO acessos (pessoa_id, entrada, status)
      VALUES (?, NOW(), 'dentro')
    `;
    return db.executarQuery(query, [pessoaId]);
  }

  // Registra a saída de uma pessoa
  static async registrarSaida(id) {
    const query = `
      UPDATE acessos
      SET saida  = NOW(),
          status = 'saiu'
      WHERE id = ? AND status = 'dentro'
    `;
    return db.executarQuery(query, [id]);
  }

  // Lista todos os acessos (histórico completo) com nome da pessoa
  static async listarTodos() {
    const query = `
      SELECT a.id, a.entrada, a.saida, a.status,
             p.id AS pessoa_id, p.nome, p.documento
      FROM acessos a
      JOIN pessoas p ON p.id = a.pessoa_id
      ORDER BY a.entrada DESC
    `;
    return db.executarQuery(query);
  }

  // Histórico de acessos de uma pessoa específica
  static async historicoPorPessoa(pessoaId) {
    const query = `
      SELECT a.id, a.entrada, a.saida, a.status,
             p.nome, p.documento
      FROM acessos a
      JOIN pessoas p ON p.id = a.pessoa_id
      WHERE a.pessoa_id = ?
      ORDER BY a.entrada DESC
    `;
    return db.executarQuery(query, [pessoaId]);
  }
}

module.exports = Acesso;
