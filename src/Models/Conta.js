const mongoose = require('mongoose')
const ListItem = require('./ListItem')
const ContaSchema = new mongoose.Schema({
    nome_cliente: String,
    dt_criacao: Date,
    dt_pagamento: Date || null,
    valor_pago: Number || null,
    pago: Boolean,
    desconto: Boolean,
    listItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem'
        }
    ]
})

ContaSchema.post('findOneAndDelete', async contaRemovida => {
    let itemsDaConta = contaRemovida.listItems,
        ids_itemsDaConta = []
    
    if(itemsDaConta.length > 0 ){
        itemsDaConta.map(item => {
            ids_itemsDaConta.push(item.item)
        })
        await ListItem.deleteMany({_id: ids_itemsDaConta})
        // deletar lancamentoListItem
    }
    return
})

module.exports = mongoose.model('Conta', ContaSchema)