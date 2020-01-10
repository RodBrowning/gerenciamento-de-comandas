const express = require('express')
const rotasDeNivelDeAcesso = express.Router()
const NivelDeAcessoController = require('../Controllers/Autenticacao/nivelDeAcessoController')
const Usuario = require('../Models/Usuario')
const { isGestorMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')

rotasDeNivelDeAcesso.use((req, res, next)=>{
    req.model = Usuario
    next()
})
const bundledMiddlewaresGestor = [isGestorMiddleware, isDesteEstabelecimentoMiddleware]

    // PUT
    rotasDeNivelDeAcesso.put('/alterarAcessoDoUsuario/:id_usuario_alterar',bundledMiddlewaresGestor, NivelDeAcessoController.alterarNivelDeAcesso)
    rotasDeNivelDeAcesso.put('/atualizarAssinatura',isGestorMiddleware, NivelDeAcessoController.atualizarAssinatura)


module.exports = rotasDeNivelDeAcesso