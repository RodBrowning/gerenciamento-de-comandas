const express = require('express')
const RotasAutenticacao = express.Router()
const AutenticacaoController = require('../Controllers/Autenticacao/AutenticacaoController')
const {verificarSeUsuarioEestabelecimentoExistem} = require('../Services/MiddlewaresDeAutenticacao')

// Criar middleware do plano de acesso
// Rotas de Autenticação
    // POST
    RotasAutenticacao.post('/singin', verificarSeUsuarioEestabelecimentoExistem, AutenticacaoController.singin)
    RotasAutenticacao.post('/login',AutenticacaoController.login)
    RotasAutenticacao.post('/logout',AutenticacaoController.logout)
    
    RotasAutenticacao.get('/validacaoDeUsuario/:email/:emailToken', AutenticacaoController.validarUsuario)

module.exports = RotasAutenticacao

