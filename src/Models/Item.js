const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    nome_item: String,
    preco: Number,
    categoria: {type: String, enum: ["produto","alimento","bebida"], default: "produto"},
    tipo: {type: String, default: null},
    com_preparo: {type: Boolean, default: false },
    departamento: {type: String, enum: ["praca","cozinha","bar","churrasqueira","caixa"], default: "praca"},
    ex_dicas: {type: String, default: 'ex. "Sem cebola", "Copos limpos", "Mande guardanapos", "Capricha no álcool", "etc.."'}
})

module.exports = mongoose.model("Item", ItemSchema)