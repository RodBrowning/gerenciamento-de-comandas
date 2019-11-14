const express = require('express')
const RotasCardapio = express.Router()
const { isAdministradorMiddleware, isFuncionarioMiddleware, isDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')
const Cardapio = require('../Models/Cardapio')

// RotasCardapio.use((req, res, next)=>{
//     req.model = Cardapio
//     next()
// })
const atribuirModeloMiddleware = (req, res, next)=>{
    req.model = Cardapio
    next()
}
const bundledMiddlewares = [atribuirModeloMiddleware, isDesteEstabelecimentoMiddleware]
const bundledMiddlewaresAdministrador =  [isAdministradorMiddleware, ...bundledMiddlewares ]
const bundledMiddlewaresFuncionario = [ isFuncionarioMiddleware, ...bundledMiddlewares ]


// Rotas de Cardapio
const CardapioController = require('../Controllers/Item/CardapioController')
    // POSTS
    RotasCardapio.post('/novoCardapio', isAdministradorMiddleware, CardapioController.store)
    // UPDATE
    RotasCardapio.put('/editarCardapio/:id_cardapio_editar', bundledMiddlewaresAdministrador, CardapioController.update)
    // Delete
    RotasCardapio.delete('/removerCardapio/:id_cardapio_remover', bundledMiddlewaresAdministrador, CardapioController.destroy)
    // GET
    RotasCardapio.get('/buscarCardapios', isAdministradorMiddleware, CardapioController.show)
    RotasCardapio.get('/buscarCardapio/:id_cardapio', bundledMiddlewaresFuncionario, CardapioController.index)

module.exports = RotasCardapio