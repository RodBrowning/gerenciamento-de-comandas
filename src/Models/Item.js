const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    nome_item: String,
    preco: Number
})

module.exports = mongoose.model("Item", ItemSchema)