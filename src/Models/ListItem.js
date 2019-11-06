const mongoose = require('mongoose')

const ListItemSchema = new mongoose.Schema({
    id_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    id_lancamentoListItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LancamentoListItem'
    }],
    dataCriacao: {type: Date, default: Date.now()}
})

module.exports = mongoose.model("ListItem", ListItemSchema)