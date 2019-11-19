const express = require('express')
const RotasItem = express.Router()
const { isAdministradorMiddleware, isItemNoCardapioAtivo } = require('../Services/Middlewares')

const bundledMiddlewares = [isAdministradorMiddleware, isItemNoCardapioAtivo]
// Rotas de items
const ItemController = require('../Controllers/Item/ItemController')
    //POSTS
    RotasItem.post('/novoItem', isAdministradorMiddleware, ItemController.store)
    // DELETE
    RotasItem.delete('/removerItem/:id_item_remover', bundledMiddlewares, ItemController.destroy)
    // UPDATE
    RotasItem.put('/editarItem/:id_item_editar', bundledMiddlewares, ItemController.update)
    // GET
    RotasItem.get('/buscarItems', ItemController.show)
    RotasItem.get('/buscarItem/:id_item_buscar', isItemNoCardapioAtivo, ItemController.index)

module.exports = RotasItem