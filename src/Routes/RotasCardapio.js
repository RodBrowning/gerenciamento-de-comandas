const express = require('express')
const RotasCardapio = express.Router()

// Rotas de Cardapio
const CardapioController = require('../Controllers/Item/CardapioController')
    // POSTS
    RotasCardapio.post('/novoCardapio', CardapioController.store)
    

module.exports = RotasCardapio