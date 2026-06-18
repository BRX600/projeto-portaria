// ============================================================
// controllers/pessoa.controller.js
// ============================================================

const Pessoa = require("../models/pessoa.model");

const listarPessoas = async (req, res) => {
  try {
    const pessoas = await Pessoa.listarTodas();
    res.render("pessoas/lista", {
      title: "Pessoas Cadastradas",
      pessoas,
      mensagem: req.query.msg || null,
      erro: req.query.erro || null,
    });
  } catch (err) {
    console.error("[CONTROLLER] Erro ao listar pessoas:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

const listarInativas = async (req, res) => {
  try {
    const pessoas = await Pessoa.listarInativas();
    res.render("pessoas/inativas", {
      title: "Pessoas Inativas",
      pessoas,
      mensagem: req.query.msg || null,
    });
  } catch (err) {
    console.error("[CONTROLLER] Erro ao listar inativas:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

const exibirFormulario = (req, res) => {
  res.render("pessoas/form", { title: "Cadastrar Pessoa", erro: null });
};

const cadastrarPessoa = async (req, res) => {
  const { nome, documento } = req.body;

  if (!nome || nome.trim() === "" || !documento || documento.trim() === "") {
    return res.render("pessoas/form", {
      title: "Cadastrar Pessoa",
      erro: "Nome e Documento são obrigatórios.",
    });
  }

  try {
    const existente = await Pessoa.buscarPorDocumento(documento);
    if (existente) {
      return res.render("pessoas/form", {
        title: "Cadastrar Pessoa",
        erro: `Documento ${documento} já cadastrado para ${existente.nome}.`,
      });
    }
    await Pessoa.cadastrar(nome, documento);
    res.redirect("/pessoas");
  } catch (err) {
    console.error("[CONTROLLER] Erro ao cadastrar:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

const desativarPessoa = async (req, res) => {
  const { id } = req.params;
  try {
    const pessoa = await Pessoa.buscarPorId(id);
    if (!pessoa) return res.redirect("/pessoas?erro=Pessoa+não+encontrada.");

    await Pessoa.desativar(id);
    const msg = encodeURIComponent(
      `${pessoa.nome} foi desativado(a). O histórico foi preservado.`
    );
    res.redirect(`/pessoas?msg=${msg}`);
  } catch (err) {
    console.error("[CONTROLLER] Erro ao desativar:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

const reativarPessoa = async (req, res) => {
  const { id } = req.params;
  try {
    const pessoa = await Pessoa.buscarPorId(id);
    if (!pessoa) return res.redirect("/pessoas/inativas?erro=Pessoa+não+encontrada.");

    await Pessoa.reativar(id);
    const msg = encodeURIComponent(`${pessoa.nome} foi reativado(a) com sucesso.`);
    res.redirect(`/pessoas/inativas?msg=${msg}`);
  } catch (err) {
    console.error("[CONTROLLER] Erro ao reativar:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

const deletarPessoa = async (req, res) => {
  const { id } = req.params;
  try {
    const pessoa = await Pessoa.buscarPorId(id);
    if (!pessoa) return res.redirect("/pessoas?erro=Pessoa+não+encontrada.");

    const temAcessos = await Pessoa.possuiAcessos(id);
    if (temAcessos) {
      const msg = encodeURIComponent(
        `Não é possível excluir ${pessoa.nome} pois ela possui histórico de acessos.`
      );
      return res.redirect(`/pessoas?erro=${msg}`);
    }

    await Pessoa.deletar(id);
    const msg = encodeURIComponent(`${pessoa.nome} foi removido(a) com sucesso.`);
    res.redirect(`/pessoas?msg=${msg}`);
  } catch (err) {
    console.error("[CONTROLLER] Erro ao deletar:", err.message);
    res.status(500).render("erro404", { title: "Erro interno" });
  }
};

module.exports = {
  listarPessoas,
  listarInativas,
  exibirFormulario,
  cadastrarPessoa,
  desativarPessoa,
  reativarPessoa,
  deletarPessoa,
};
