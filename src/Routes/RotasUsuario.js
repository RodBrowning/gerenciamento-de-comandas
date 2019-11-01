const express = require('express')
const RotasUsuario = express.Router()
const { middlewareIsAdministrador } = require('../Services/Middlewares')

// Rotas de usuario
const UsuarioController = require('../Controllers/Usuario/UsuarioController')
    // POSTS
    RotasUsuario.post('/novoUsuario', UsuarioController.store)
    // DELETE
    RotasUsuario.delete('/removerUsuario/:id_usuario_deletar', middlewareIsAdministrador, UsuarioController.destroy)
    // UPDATE
    RotasUsuario.put('/editarUsuario/:id_usuario_editar', middlewareIsAdministrador, UsuarioController.update)
    // GET
    RotasUsuario.get('/buscarUsuarios', middlewareIsAdministrador, UsuarioController.show)
    RotasUsuario.get('/buscarUsuario/:id_usuario_buscar', middlewareIsAdministrador, UsuarioController.index)

module.exports = RotasUsuario