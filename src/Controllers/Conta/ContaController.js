// index, show, store, update, destroy.  
const Conta = require('../../Models/Conta')

module.exports = {
    async store(req, res){
        let novaConta = {
            nome_cliente,
            dt_criacao,
            dt_pagamento,
            listItems,
            valor_pago,
            pago,
            desconto
        } = req.body,
            response = null
        let conta = await Conta.findOne({nome_cliente})
        
        if(conta){
            response  = { error: "Conta já existe"}
        } else {
            response = await Conta.create(novaConta)
        }
        return res.json(response)
    },
    async destroy(req, res){
        let response = null
        response = await Conta.findOneAndDelete({_id: req.params.id_conta_remover})
        return res.json(response)
    },
    async update(req, res){
        let contaParaAtualizar = { nome_cliente, dt_pagamento, valor_pago, pago, desconto, listItems } = req.body,
            { id_conta_editar } = req.params,
            response = null
        
        response = await Conta.findByIdAndUpdate({_id: id_conta_editar}, contaParaAtualizar, {new:true})
        return res.json(response)
    },
    async show(req, res){
        let response = null
        response =  await Conta.find({})
        .populate({
            path: "listItems", 
            model: "ListItem",
            populate: {
                path: "id_item",
                model: "Item"
            },
            populate: {
                path: "id_lancamentoListItem",
                model: "LancamentoListItem"
            }
        })
        return res.json(response)
    },
    async index(req, res){
        let response = null,
            {id_conta} = req.params
        response = await Conta.findOne({_id: id_conta})
        .populate({
            path: "listItems", 
            model: "ListItem",
            populate: {
                path: "id_item",
                model: "Item"
            },
            populate: {
                path: "id_lancamentoListItem",
                model: "LancamentoListItem"
            }
        })
        return res.json(response)
    }
}

/// Ver se tem um forma de filtrar o nested populate
