const mongoose = require('mongoose')
const LancamentoListItem = require('./LancamentoListItem')

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

ListItemSchema.post('findOneAndDelete',async ListItemRemovida => {
    let {ids_lancamentoListItem} = ListItemRemovida
    if( ids_lancamentoListItem.length > 0){
         ids_lancamentoListItem.map(async id_lancamentoListItem =>{
            await LancamentoListItem.findOneAndDelete({_id: id_lancamentoListItem})
        })
    }
    return
})

module.exports = mongoose.model("ListItem", ListItemSchema)