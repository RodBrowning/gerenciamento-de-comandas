const express = require('express')
const RotasItem = express.Router()
const { isAdministradorMiddleware } = require('../Services/Middlewares')

// Rotas de items
const ItemController = require('../Controllers/Item/ItemController')
    //POSTS
    RotasItem.post('/novoItem', isAdministradorMiddleware, ItemController.store)
    // DELETE
    RotasItem.delete('/removerItem', isAdministradorMiddleware, ItemController.destroy)
    // UPDATE
    RotasItem.put('/editarItem/:id_item_editar', isAdministradorMiddleware, ItemController.update)
    // GET
    RotasItem.get('/buscarItems', ItemController.show)
    RotasItem.get('/buscarItem/:id_item_buscar', ItemController.index)

module.exports = RotasItem