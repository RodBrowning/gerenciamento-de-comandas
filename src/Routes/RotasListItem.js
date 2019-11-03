const express = require('express')
const RotasListItem = express.Router()
const { middlewareIsFuncionario } = require('../Services/Middlewares')

// Rotas de ListItems
const ListItemController = require('../Controllers/Conta/ListItemController')
    //POSTS
    RotasListItem.post('/novoListItem', middlewareIsFuncionario, ListItemController.store)
    //UPDATE
    RotasListItem.put('/editarListItem/:id_listItem_editar', middlewareIsFuncionario, ListItemController.update)
    //DELETE
    RotasListItem.delete('/removerListItem/:id_listitem_remover', middlewareIsFuncionario, ListItemController.destroy)

module.exports = RotasListItem