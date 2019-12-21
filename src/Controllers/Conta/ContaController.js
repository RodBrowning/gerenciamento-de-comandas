// index, show, store, update, destroy.  
const Conta = require('../../Models/Conta')
const Estabelecimento = require('../../Models/Estabelecimento')

module.exports = {
    async store(req, res){
        let novaConta = {
            nome_cliente,
            numero_comanda,
            dt_criacao,
            listItems,
            id_usuario_checkin
        } = req.body,
            {id_estabelecimento} = req.headers,
            response = null,
            statusCode = 200
        let conta = await Conta.findOne({nome_cliente, numero_comanda})
        
        if(conta){
            response  = { Error: "Conta já existe" }
            statusCode = 400
        } else {
            response = await Conta.create(novaConta)
            estabelecimentoAtualizado = await Estabelecimento.findByIdAndUpdate({_id:id_estabelecimento}, {$push:{contas: response._id}},{new:true})
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
        let contaParaAtualizar = { 
                nome_cliente,
                numero_comanda,
                dt_criacao,
                dt_pagamento,
                valor_pago,
                pago,
                desconto,
                listItems,
                id_usuario_checkin,
                id_usuario_checkout,
                observacao_do_cliente
            } = req.body,
            { id_conta_editar } = req.params,
            conta = null,
            response = null,
            statusCode = 200
        
        conta = await Conta.findOne({_id: id_conta_editar})
        if (conta.pago === true) {
            statusCode = 400
            response = { Error: 'Está conta já foi fechada' }
        } else {
            conta.total_conta <= (contaParaAtualizar.valor_pago + conta.valor_pago) ? contaParaAtualizar.pago = true : contaParaAtualizar.pago = false
            contaParaAtualizar.desconto === true ? contaParaAtualizar.pago = true : false
            
            response = await Conta.findByIdAndUpdate({_id: id_conta_editar}, contaParaAtualizar, {new:true})
        }
        return res.status(statusCode).json(response)
    },
    async show(req, res){
        let {id_estabelecimento} = req.headers,
            response = null,
            estabelecimento = null
        
        estabelecimento = await Estabelecimento.findOne({_id: id_estabelecimento})
        response =  await Conta.find({_id: estabelecimento.contas})
        .populate({
            path: "listItems", 
            model: "ListItem",
            populate: [{
                path: "id_item",
                model: "Item"
            },
            {
                path: "ids_lancamentoListItem",
                model: "LancamentoListItem"
            }]
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
                path: "ids_lancamentoListItem",
                model: "LancamentoListItem"
            }]
        })

        return res.status(statusCode).json(response)
    }
}

/// Ver se tem alguma forma de filtrar o nested populate
