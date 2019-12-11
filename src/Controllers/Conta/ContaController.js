// index, show, store, update, destroy.  
const Conta = require('../../Models/Conta')
const Estabelecimento = require('../../Models/Estabelecimento')

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
            response = null,
            statusCode = 200
        let conta = await Conta.findOne({nome_cliente})
        
        if(conta){
            response  = { Error: "Conta já existe" }
            statusCode = 400
        } else {
            response = await Conta.create(novaConta)
            estabelecimentoAtualizado = await Estabelecimento.findByIdAndUpdate({_id:req.headers.id_estabelecimento}, {$push:{contas: response._id}},{new:true})
        }
        return res.status(statusCode).json(response)
    },
    async destroy(req, res){
        let response = null,
            statusCode = 200
        response = await Conta.findOneAndDelete({_id: req.params.id_conta_remover})
        estabelecimentoAtualizado = await Estabelecimento.findByIdAndUpdate({_id:req.headers.id_estabelecimento}, {$pull:{contas: response._id}},{new:true})
        
        return res.status(statusCode).json(response)
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
            statusCode = 200,
            {id_conta} = req.params
        response = await Conta.findById({_id: id_conta})
        .populate({
            path: "listItems", 
            model: "ListItem",
            populate: [{
                path: "id_item",
                model: "Item"
            },
            {
                path: "id_lancamentoListItem",
                model: "LancamentoListItem"
            }]
        })
        
        // response.listItems.map(listItem=>{
        //     let quantidadeTotal = Object.values(listItem.id_lancamentoListItem).reduce((t, {quantidade}) => t + quantidade, 0)
        //     listItem.quantidadeTotal = quantidadeTotal
        //     let subTotal = listItem.quantidadeTotal * listItem.id_item.preco
        //     listItem.subTotal = subTotal
        //     return listItem
        // })
        
        
        return res.status(statusCode).json(response)
    }
}

/// Ver se tem alguma forma de filtrar o nested populate
