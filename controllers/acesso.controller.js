// ============================================================
// controllers/acesso.controller.js
// Adaptado de veiculo.controller.js do projeto base.
// Gerencia o fluxo de entrada/saída e histórico de acessos.
//
// Regras de negócio aplicadas aqui:
//   1. Pessoa não pode entrar se já estiver dentro
//   2. Pessoa não pode sair se não entrou (ou já saiu)
//   3. Cada entrada corresponde a exatamente uma saída
// ============================================================

const Acesso  = require("../models/acesso.model");
const Pessoa  = require("../models/pessoa.model");

// GET /acessos — Exibe tela de registro de entrada/saída com lista de pessoas
const exibirRegistro = async (req, res) => {
  try {
    const pessoas = await Pessoa.listarTodas();

    // Para cada pessoa, verifica se está dentro para exibir botão correto
    const pessoasComStatus = await Promise.all(
      pessoas.map(async (p) => {
        const acessoAtivo = await Acesso.buscarAtivoporPessoa(p.id);
        return {
          ...p,
          dentro:    !!acessoAtivo,
          acessoId:  acessoAtivo ? acessoAtivo.id : null,
          entradaEm: acessoAtivo ? acessoAtivo.entrada : null,
        };
      })
    );

    res.render("acessos/registro", {
      title: "Registro de Entrada / Saída",
      pessoas: pessoasComStatus,
      mensagem: req.query.msg || null,
      erro: req.query.erro || null,
    });
  } catch (err) {
    console.error("[CONTROLLER] Erro ao exibir registro:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

// POST /acessos/entrada/:pessoaId — Registra entrada
const registrarEntrada = async (req, res) => {
  const { pessoaId } = req.params;

  try {
    const pessoa = await Pessoa.buscarPorId(pessoaId);
    if (!pessoa) {
      return res.redirect("/acessos?erro=Pessoa+não+encontrada.");
    }

    // REGRA DE NEGÓCIO: não pode entrar duas vezes sem sair
    const acessoAtivo = await Acesso.buscarAtivoporPessoa(pessoaId);
    if (acessoAtivo) {
      const msg = encodeURIComponent(
        `${pessoa.nome} já está dentro desde ${new Date(acessoAtivo.entrada).toLocaleString("pt-BR")}.`
      );
      return res.redirect(`/acessos?erro=${msg}`);
    }

    await Acesso.registrarEntrada(pessoaId);
    const msg = encodeURIComponent(`Entrada de ${pessoa.nome} registrada com sucesso.`);
    res.redirect(`/acessos?msg=${msg}`);
  } catch (err) {
    console.error("[CONTROLLER] Erro ao registrar entrada:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

// POST /acessos/saida/:acessoId — Registra saída
const registrarSaida = async (req, res) => {
  const { acessoId } = req.params;

  try {
    const acesso = await Acesso.buscarPorId(acessoId);

    if (!acesso) {
      return res.redirect("/acessos?erro=Registro+de+acesso+não+encontrado.");
    }

    // REGRA DE NEGÓCIO: só pode sair se estiver dentro
    if (acesso.status !== "dentro") {
      const msg = encodeURIComponent(`${acesso.nome} já registrou saída anteriormente.`);
      return res.redirect(`/acessos?erro=${msg}`);
    }

    await Acesso.registrarSaida(acessoId);
    const msg = encodeURIComponent(`Saída de ${acesso.nome} registrada com sucesso.`);
    res.redirect(`/acessos?msg=${msg}`);
  } catch (err) {
    console.error("[CONTROLLER] Erro ao registrar saída:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

// GET /acessos/historico — Visualiza todos os registros
const listarHistorico = async (req, res) => {
  try {
    const acessos  = await Acesso.listarTodos();
    const pessoas  = await Pessoa.listarTodas();

    // Filtro opcional por pessoa
    const pessoaIdFiltro = req.query.pessoa_id || "";
    const acessosFiltrados = pessoaIdFiltro
      ? acessos.filter((a) => String(a.pessoa_id) === String(pessoaIdFiltro))
      : acessos;

    res.render("acessos/historico", {
      title: "Histórico de Acessos",
      acessos: acessosFiltrados,
      pessoas,
      pessoaIdFiltro,
    });
  } catch (err) {
    console.error("[CONTROLLER] Erro ao listar histórico:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

module.exports = {
  exibirRegistro,
  registrarEntrada,
  registrarSaida,
  listarHistorico,
};
