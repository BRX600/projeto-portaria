const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/pessoa.controller");

router.get("/",                  ctrl.listarPessoas);
router.get("/nova",              ctrl.exibirFormulario);
router.get("/inativas",          ctrl.listarInativas);
router.post("/",                 ctrl.cadastrarPessoa);
router.post("/desativar/:id",    ctrl.desativarPessoa);
router.post("/reativar/:id",     ctrl.reativarPessoa);
router.post("/deletar/:id",      ctrl.deletarPessoa);

module.exports = router;
