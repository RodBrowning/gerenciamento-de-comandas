const express = require('express')
const RotasEstabelecimento = express.Router()

// Rotas de estabelecimento
const EstabelecimentoController = require('../Controllers/Estabelecimento/EstabelecimentoController')
const EnderecoEstabelecimentoController = require('../Controllers/Estabelecimento/EnderecoEstabelecimentoController')
    // POSTS
    RotasEstabelecimento.post('/novoEstabelecimento', EstabelecimentoController.store)
    RotasEstabelecimento.post('/novoEnderecoEstabelecimento', EnderecoEstabelecimentoController.store)
    // UPDATE
    RotasEstabelecimento.put('/editarEstabelecimento', EstabelecimentoController.update)
    RotasEstabelecimento.put('/editarEnderecoEstabelecimento', EnderecoEstabelecimentoController.update)
    // DELETE
    RotasEstabelecimento.delete('/removerEstabelecimento/:id_estabelecimento_remover', EstabelecimentoController.destroy)
    // GET
    RotasEstabelecimento.get('/burcarEstabelecimentosDoUsuario', EstabelecimentoController.show)
    RotasEstabelecimento.get('/burcarEstabelecimento', EstabelecimentoController.index)

module.exports = RotasEstabelecimento