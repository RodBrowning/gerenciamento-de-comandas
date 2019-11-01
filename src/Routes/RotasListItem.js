const express = require('express')
const RotasListItem = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario } = require('../Services/Middlewares')

// Rotas de ListItems
const ListItemController = require('../Controllers/Conta/ListItemController')
    //POSTS
    RotasListItem.post('/novoListItem', middlewareIsFuncionario, ListItemController.store)
    //UPDATE
    RotasListItem.put('/editarListItem', middlewareIsFuncionario, ListItemController.update)
    //DELETE

module.exports = RotasListItem