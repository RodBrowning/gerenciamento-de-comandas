const express = require('express')
const RotasListItem = express.Router()

// Rotas de ListItems
const ListItemController = require('../Controllers/Conta/ListItemController')
    //POSTS
    RotasListItem.post('/novoListItem', ListItemController.store)

module.exports = RotasListItem