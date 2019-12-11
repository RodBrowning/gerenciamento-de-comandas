const express = require('express')
const RotasItem = express.Router()
const { isAdministradorMiddleware, isItemNoCardapio } = require('../Services/Middlewares')

const bundledMiddlewares = [isAdministradorMiddleware, isItemNoCardapio]
// Rotas de items
const ItemController = require('../Controllers/Item/ItemController')
    //POSTS
    RotasItem.post('/novoItem', isAdministradorMiddleware, ItemController.store)
    // DELETE
    RotasItem.delete('/removerItem/:id_item_remover/:id_cardapio', bundledMiddlewares, ItemController.destroy)
    // UPDATE
    RotasItem.put('/editarItem/:id_item_editar/:id_cardapio', bundledMiddlewares, ItemController.update)
    // GET
    RotasItem.get('/buscarItems', ItemController.show)
    RotasItem.get('/buscarItem/:id_item_buscar/:id_cardapio', isItemNoCardapio, ItemController.index)

module.exports = RotasItem