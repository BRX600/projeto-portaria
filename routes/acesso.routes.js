const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/acesso.controller");

router.get("/",                       ctrl.exibirRegistro);
router.post("/entrada/:pessoaId",     ctrl.registrarEntrada);
router.post("/saida/:acessoId",       ctrl.registrarSaida);
router.get("/historico",              ctrl.listarHistorico);

module.exports = router;
