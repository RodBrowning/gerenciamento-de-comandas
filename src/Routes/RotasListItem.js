const express = require('express')
const RotasListItem = express.Router()
const { isFuncionarioMiddleware } = require('../Services/Middlewares')

// Rotas de ListItems
const ListItemController = require('../Controllers/Conta/ListItemController')
    //POSTS
    RotasListItem.post('/novoListItem', isFuncionarioMiddleware, ListItemController.store)
    //UPDATE
    RotasListItem.put('/editarListItem/:id_listItem_editar', isFuncionarioMiddleware, ListItemController.update)
    //DELETE
    RotasListItem.delete('/removerListItem/:id_listitem_remover', isFuncionarioMiddleware, ListItemController.destroy)

module.exports = RotasListItem