const express = require('express')
const rotasDeNivelDeAcesso = express.Router()
const NivelDeAcessoController = require('../Controllers/Autenticacao/nivelDeAcessoController')
const Usuario = require('../Models/Usuario')
const { isAdministradorMiddleware, isDonoMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')

rotasDeNivelDeAcesso.use((req, res, next)=>{
    req.model = Usuario
    next()
})
const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, isDesteEstabelecimentoMiddleware]

    // PUT
    rotasDeNivelDeAcesso.put('/alterarAcessoDoUsuario/:id_usuario_alterar',bundledMiddlewaresAdministrador, NivelDeAcessoController.alterarNivelDeAcesso)
    rotasDeNivelDeAcesso.put('/atualizarAssinatura',isDonoMiddleware, NivelDeAcessoController.atualizarAssinatura)


module.exports = rotasDeNivelDeAcesso