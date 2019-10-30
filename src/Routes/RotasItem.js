const express = require('express')
const RotasItem = express.Router()

// Rotas de items
const ItemController = require('../Controllers/Item/ItemController')
    //POSTS
    RotasItem.post('/novoItem', ItemController.store)
    // DELETE
    RotasItem.delete('/removerItem', ItemController.destroy)
    // UPDATE
    RotasItem.put('/editarItem/:id_item_editar', ItemController.update)
    // GET
    RotasItem.get('/buscarItems', ItemController.show)
    RotasItem.get('/buscarItem/:id_item_buscar', ItemController.index)

module.exports = RotasItem