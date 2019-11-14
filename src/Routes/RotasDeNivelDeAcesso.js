const express = require('express')
const rotasDeNivelDeAcesso = express.Router()
const NivelDeAcessoController = require('../Controllers/Autenticacao/nivelDeAcessoController')
const Usuario = require('../Models/Usuario')
const { isAdministradorMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')

rotasDeNivelDeAcesso.use((req, res, next)=>{
    req.model = Usuario
    next()
})
const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, isDesteEstabelecimentoMiddleware]

// POST
rotasDeNivelDeAcesso.post('/alterarAcessoDoUsuario/:id_usuario_alterar',bundledMiddlewaresAdministrador, NivelDeAcessoController.alterarNivelDeAcesso)


module.exports = rotasDeNivelDeAcesso