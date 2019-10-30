const express = require('express')
const RotasEndereco = express.Router()

// Rotas de endereco
const EnderecoEstabelecimentoController = require('../Controllers/Estabelecimento/EnderecoEstabelecimentoController')
    // POSTS
    RotasEndereco.post('/novoEnderecoEstabelecimento', EnderecoEstabelecimentoController.store)
    // UPDATE
    RotasEndereco.put('/editarEnderecoEstabelecimento', EnderecoEstabelecimentoController.update)
    
module.exports = RotasEndereco