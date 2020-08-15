const express = require('express')
const RotasItem = express.Router()
const { isAdministradorMiddleware, isItemNoEstabelecimento } = require('../Services/Middlewares')

const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, isItemNoEstabelecimento]
// Rotas de items
const ItemController = require('../Controllers/Item/ItemController')
    //POSTS
    RotasItem.post('/novoItem', isAdministradorMiddleware, ItemController.store)
    // DELETE
    RotasItem.delete('/removerItem/:id_item_remover/:id_estabelecimento', bundledMiddlewaresAdministrador, ItemController.destroy)
    // UPDATE
    RotasItem.put('/editarItem/:id_item_editar/:id_estabelecimento', bundledMiddlewaresAdministrador, ItemController.update)
    // GET
    RotasItem.get('/buscarItems', ItemController.show)
    RotasItem.get('/buscarItem/:id_item_buscar/:id_estabelecimento', isItemNoEstabelecimento, ItemController.index)

module.exports = RotasItem