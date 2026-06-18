// ============================================================
// index.js — Ponto de entrada da aplicação
// Adaptado do projeto de estacionamento (veiculo.controller.js)
// para o domínio de Portaria de Pessoas.
// ============================================================

const express = require("express");
const morgan  = require("morgan");
require("dotenv").config();

const app = express();

// Rotas
const pessoaRoutes = require("./routes/pessoa.routes");
const acessoRoutes = require("./routes/acesso.routes");

// View engine
app.set("views", "./views");
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validação de variáveis de ambiente (padrão herdado do projeto base)
const porta = Number(process.env.PORTA);
if (!porta || isNaN(porta)) {
  console.error("[FATAL] Variável PORTA não definida ou inválida no .env");
  process.exit(1);
}

// Rotas da aplicação
app.use("/pessoas", pessoaRoutes);
app.use("/acessos", acessoRoutes);

// Redireciona raiz para listagem de pessoas
app.get("/", (req, res) => res.redirect("/pessoas"));

// 404
app.use((req, res) => {
  res.status(404).render("erro404", { title: "Página não encontrada" });
});

// Error handler global (padrão do projeto base)
app.use((err, req, res, next) => {
  console.error("[ERRO GLOBAL]", err.stack);
  res.status(500).render("erro404", { title: "Erro interno do servidor" });
});

app.listen(porta, () => {
  console.log("Servidor rodando em http://localhost:" + porta);
});
