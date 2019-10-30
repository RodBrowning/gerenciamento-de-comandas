const express = require('express')
const RotasUsuario = express.Router()

// Rotas de usuario
const UsuarioController = require('../Controllers/Usuario/UsuarioController')
    // POSTS
    RotasUsuario.post('/novoUsuario', UsuarioController.store)
    // DELETE
    RotasUsuario.delete('/removerUsuario/:id_usuario_deletar', UsuarioController.destroy)
    // UPDATE
    RotasUsuario.put('/editarUsuario/:id_usuario_editar', UsuarioController.update)
    // GET
    RotasUsuario.get('/buscarUsuarios', UsuarioController.show)
    RotasUsuario.get('/buscarUsuario/:id_usuario_buscar', UsuarioController.index)

module.exports = RotasUsuario