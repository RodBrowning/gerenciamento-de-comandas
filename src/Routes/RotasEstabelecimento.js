const express = require('express')
const RotasEstabelecimento = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario } = require('../Services/Middlewares')

// Rotas de estabelecimento
const EstabelecimentoController = require('../Controllers/Estabelecimento/EstabelecimentoController')
    // POSTS
    RotasEstabelecimento.post('/novoEstabelecimento', EstabelecimentoController.store)
    // UPDATE
    RotasEstabelecimento.put('/editarEstabelecimento', middlewareIsAdministrador, EstabelecimentoController.update)
    // DELETE
    RotasEstabelecimento.delete('/removerEstabelecimento', middlewareIsAdministrador, EstabelecimentoController.destroy)
    // GET
    RotasEstabelecimento.get('/burcarEstabelecimentosDoUsuario', middlewareIsFuncionario, EstabelecimentoController.show)
    RotasEstabelecimento.get('/burcarEstabelecimento', middlewareIsFuncionario, EstabelecimentoController.index)

module.exports = RotasEstabelecimento