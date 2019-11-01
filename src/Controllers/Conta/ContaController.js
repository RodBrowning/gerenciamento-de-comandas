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
        response = await Conta.findOneAndDelete({_id: req.query.id_conta})
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
        let response = await Conta.find({})
        return res.json(response)
    }
}

