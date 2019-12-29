const mongoose = require('mongoose')

const AcompanhamentoSchema = new mongoose.Schema({
    nome_acompanhamento: String,
    preco: Number,
    tipo_acompanhamento: String
})

module.exports = mongoose.model("Acompanhamento", AcompanhamentoSchema)