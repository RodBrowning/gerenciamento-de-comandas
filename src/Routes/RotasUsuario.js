const express = require('express')
const RotasUsuario = express.Router()
const { isAdministradorMiddleware, isFuncionarioMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')
const Usuario = require('../Models/Usuario')

const atribuirModeloMiddleware = (req, res, next)=>{
    req.model = Usuario
    next()
}
const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, atribuirModeloMiddleware, isDesteEstabelecimentoMiddleware]

// Rotas de usuario
const UsuarioController = require('../Controllers/Usuario/UsuarioController')
    // POSTS
    RotasUsuario.post('/novoUsuario', isAdministradorMiddleware, UsuarioController.store)
    // DELETE
    RotasUsuario.delete('/removerUsuario/:id_usuario_deletar', bundledMiddlewaresAdministrador, UsuarioController.destroy)
    // UPDATE
    RotasUsuario.put('/editarUsuario/:id_usuario_editar', bundledMiddlewaresAdministrador, UsuarioController.update)
    // GET
    RotasUsuario.get('/buscarUsuarios', isAdministradorMiddleware, UsuarioController.show)
    RotasUsuario.get('/buscarUsuario/:id_usuario_buscar', isFuncionarioMiddleware, UsuarioController.index)

module.exports = RotasUsuario