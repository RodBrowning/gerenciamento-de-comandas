const express = require('express')
const RotasCardapio = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario, middlewareIsDesteEstabelecimento } = require('../Services/Middlewares')
const Cardapio = require('../Models/Cardapio')

RotasCardapio.use((req, res, next)=>{
    req.model = Cardapio
    next()
})

// Rotas de Cardapio
const CardapioController = require('../Controllers/Item/CardapioController')
    // POSTS
    RotasCardapio.post('/novoCardapio', middlewareIsAdministrador, CardapioController.store)
    // UPDATE
    RotasCardapio.put('/editarCardapio/:id_cardapio_editar', middlewareIsAdministrador, middlewareIsDesteEstabelecimento, CardapioController.update)
    // Delete
    RotasCardapio.delete('/removerCardapio/:id_cardapio_remover', middlewareIsAdministrador, middlewareIsDesteEstabelecimento, CardapioController.destroy)
    // GET
    RotasCardapio.get('/buscarCardapios', middlewareIsAdministrador, CardapioController.show)
    RotasCardapio.get('/buscarCardapio/:id_cardapio', middlewareIsFuncionario, middlewareIsDesteEstabelecimento, CardapioController.index)

module.exports = RotasCardapio