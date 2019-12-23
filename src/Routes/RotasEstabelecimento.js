const express = require('express')
const RotasEstabelecimento = express.Router()
const { isAdministradorMiddleware, isFuncionarioMiddleware } = require('../Services/Middlewares')

// Rotas de estabelecimento
const EstabelecimentoController = require('../Controllers/Estabelecimento/EstabelecimentoController')
    // POSTS
    RotasEstabelecimento.post('/novoEstabelecimento', EstabelecimentoController.store)
    // UPDATE
    RotasEstabelecimento.put('/editarEstabelecimento', isAdministradorMiddleware, EstabelecimentoController.update)
    // DELETE
    RotasEstabelecimento.delete('/removerEstabelecimento', isAdministradorMiddleware, EstabelecimentoController.destroy)
    // GET
    RotasEstabelecimento.get('/burcarEstabelecimentosDoUsuario', EstabelecimentoController.show)
    RotasEstabelecimento.get('/burcarEstabelecimento', isFuncionarioMiddleware, EstabelecimentoController.index)

module.exports = RotasEstabelecimento