const mongoose = require('mongoose')
// const LancamentoListItem = require('./LancamentoListItem')

const ListItemSchema = new mongoose.Schema({
    id_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    id_lancamentoListItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LancamentoListItem'
    }],
    dataCriacao: {type: Date, default: Date.now()},
    quantidadeTotal: {type: Number, defaut: 0 },
    subTotal: {type: Number, defaut: 0 }
})


// ListItemSchema.post('findOneAndDelete', async listItemRemovida => {
//     console.log("TEstes");
    
//     let lancamentosListItem = listItemRemovida.id_lancamentoListItem,
//         ids_lancamentosListItem = []
    
//     if(lancamentosListItem.length > 0 ){
//         lancamentosListItem.map(ids_lancamentosListItem => {
//             ids_lancamentosListItem.push(ids_lancamentosListItem)
//         })
//         console.log(ids_lancamentosListItem);
        
//         // await LancamentoListItem.deleteMany({_id: ids_lancamentosListItem})
//     }
//     return
// })


module.exports = mongoose.model("ListItem", ListItemSchema)