const express = require('express')
const RotasEndereco = express.Router()
const { middlewareIsAdministrador } = require('../Services/Middlewares')

// Rotas de endereco
const EnderecoEstabelecimentoController = require('../Controllers/Estabelecimento/EnderecoEstabelecimentoController')
    // POSTS
    RotasEndereco.post('/novoEnderecoEstabelecimento', EnderecoEstabelecimentoController.store)
    // UPDATE
    RotasEndereco.put('/editarEnderecoEstabelecimento', middlewareIsAdministrador, EnderecoEstabelecimentoController.update)
    
module.exports = RotasEndereco