const mongoose = require('mongoose')
const ListItem = require('./ListItem')

const ContaSchema = new mongoose.Schema({
    nome_cliente: String,
    dt_criacao: {type: Date, default: new Date()},
    dt_pagamento: {type: Date, default: null},
    total_conta: {type: Number, default: 0},
    valor_pago: {type: Number, default: 0},
    pago: {type: Boolean, default: false},
    desconto: {type: Boolean, default: false},
    listItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListItem'
        }
    ]
})

ContaSchema.post('findOneAndDelete', contaRemovida => {
    let itemsDaConta = contaRemovida.listItems
    console.log("itemsDaConta 1",itemsDaConta);
    
    if(itemsDaConta.length > 0 ){
        itemsDaConta.map(async id_listItem => {
            await ListItem.findOneAndDelete({_id: id_listItem})
        })
    }
    return
})

module.exports = mongoose.model('Conta', ContaSchema)