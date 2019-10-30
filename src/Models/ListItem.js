const mongoose = require('mongoose')

const ListItemSchema = new mongoose.Schema({
    id_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    quantidade: Number,
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model("ListItem", ListItemSchema)