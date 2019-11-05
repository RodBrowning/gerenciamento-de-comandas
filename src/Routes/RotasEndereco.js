const express = require('express')
const RotasEndereco = express.Router()
const { isAdministradorMiddleware } = require('../Services/Middlewares')

// Rotas de endereco
const EnderecoEstabelecimentoController = require('../Controllers/Estabelecimento/EnderecoEstabelecimentoController')
    // POSTS
    RotasEndereco.post('/novoEnderecoEstabelecimento', EnderecoEstabelecimentoController.store)
    // UPDATE
    RotasEndereco.put('/editarEnderecoEstabelecimento', isAdministradorMiddleware, EnderecoEstabelecimentoController.update)
    
module.exports = RotasEndereco