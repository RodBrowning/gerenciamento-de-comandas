const mongoose = require("mongoose")

const CardapioSchema = new mongoose.Schema({
    nome_cardapio: String,
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    estabelecimentos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estabelecimento'
    }]
})

module.exports = mongoose.model("Cardapio", CardapioSchema)