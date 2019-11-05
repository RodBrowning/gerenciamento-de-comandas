const express = require('express')
const RotasAutenticacao = express.Router()
const AutenticacaoController = require('../Controllers/Autenticacao/AutenticacaoController')
const {verificarSeUsuarioEestabelecimentoExistem} = require('../Services/MiddlewaresDeAutenticacao')

// Rotas de Autenticação
    // POST
    RotasAutenticacao.post('/singin', verificarSeUsuarioEestabelecimentoExistem, AutenticacaoController.singin)
    RotasAutenticacao.post('/login',AutenticacaoController.login)
    RotasAutenticacao.post('/logout',AutenticacaoController.logout)

module.exports = RotasAutenticacao

