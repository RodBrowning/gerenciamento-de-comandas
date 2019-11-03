const mongoose = require("mongoose")

const CardapioSchema = new mongoose.Schema({
    nome_cardapio: {type: String, default:"Cardapio"},
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