const mongoose = require('mongoose')

const LancamentoListItemSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    quantidade: Number,
    dataCriacao: {type: Date, default: new Date()}
})

module.exports = mongoose.model("LancamentoListItem", LancamentoListItemSchema)