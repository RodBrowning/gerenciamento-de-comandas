const express = require('express')
const RotasCardapio = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario } = require('../Services/Middlewares')

// Rotas de Cardapio
const CardapioController = require('../Controllers/Item/CardapioController')
    // POSTS
    RotasCardapio.post('/novoCardapio', middlewareIsAdministrador, CardapioController.store)
    //UPDATE
    RotasCardapio.post('/editarCardapio', middlewareIsAdministrador, CardapioController.update)
    

module.exports = RotasCardapio