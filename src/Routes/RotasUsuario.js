const express = require('express')
const RotasUsuario = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario, middlewareIsDesteEstabelecimento } = require('../Services/Middlewares')
const Usuario = require('../Models/Usuario')

RotasUsuario.use((req, res, next)=>{
    req.model = Usuario
    next()
})

// Rotas de usuario
const UsuarioController = require('../Controllers/Usuario/UsuarioController')
    // POSTS
    RotasUsuario.post('/novoUsuario', middlewareIsAdministrador, UsuarioController.store)
    // DELETE
    RotasUsuario.delete('/removerUsuario/:id_usuario_deletar', middlewareIsAdministrador, middlewareIsDesteEstabelecimento, UsuarioController.destroy)
    // UPDATE
    RotasUsuario.put('/editarUsuario/:id_usuario_editar', middlewareIsAdministrador, middlewareIsDesteEstabelecimento, UsuarioController.update)
    // GET
    RotasUsuario.get('/buscarUsuarios', middlewareIsAdministrador, UsuarioController.show)
    RotasUsuario.get('/buscarUsuario/:id_usuario_buscar', middlewareIsFuncionario, UsuarioController.index)

module.exports = RotasUsuario