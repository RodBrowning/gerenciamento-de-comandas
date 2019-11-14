const express = require('express')
const rotasBloqueioDeUsuario = express.Router()
const BloqueioController = require('../Controllers/Autenticacao/BloqueioController')
const Usuario = require('../Models/Usuario')
const { isAdministradorMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')

rotasBloqueioDeUsuario.use((req, res, next)=>{
    req.model = Usuario
    next()
})
const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, isDesteEstabelecimentoMiddleware]

// POST
// BLOQUEIO
rotasBloqueioDeUsuario.post('/bloquearusuario/:id_usuario_bloquear',bundledMiddlewaresAdministrador, BloqueioController.bloquearUsuario)
// DESBLOQUEIO
rotasBloqueioDeUsuario.post('/desbloquearusuario/:id_usuario_desbloquear',bundledMiddlewaresAdministrador, BloqueioController.desbloquearUsuario)

module.exports = rotasBloqueioDeUsuario