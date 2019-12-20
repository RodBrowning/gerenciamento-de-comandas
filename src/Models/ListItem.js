const mongoose = require('mongoose')

const ListItemSchema = new mongoose.Schema({
    id_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    ids_lancamentoListItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LancamentoListItem'
    }],
    dataCriacao: {type: Date, default: Date.now()},
    quantidadeTotal: {type: Number, defaut: 0 },
    subTotal: {type: Number, defaut: 0 }
})

module.exports = mongoose.model("ListItem", ListItemSchema)