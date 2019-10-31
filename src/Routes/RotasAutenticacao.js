const express = require('express')
const RotasAutenticacao = express.Router()
const AutenticacaoController = require('../Controllers/Autenticacao/AutenticacaoController')
const { verificarExistenciaDeToken, 
        verificarValidadeDoTokenFornecido, 
        verificarSeUsuarioEstaLogado } = require('../Services/VerificacoesDeAutenticacao')

// Rotas de Autenticação
    // POST
    RotasAutenticacao.post('/singin',AutenticacaoController.singin)
    RotasAutenticacao.post('/login',AutenticacaoController.login)
    // JWT middlewares
    RotasAutenticacao.use(verificarExistenciaDeToken, verificarValidadeDoTokenFornecido,verificarSeUsuarioEstaLogado)
    RotasAutenticacao.post('/logout',AutenticacaoController.logout)

module.exports = RotasAutenticacao

