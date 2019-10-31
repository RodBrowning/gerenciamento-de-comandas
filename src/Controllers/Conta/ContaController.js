// index, show, store, update, destroy.  
const Conta = require('../../Models/Conta')
const { isAdministrador, isFuncionario } = require('../../Services/VerificacoesDeSistema')

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
            { id_estabelecimento, id_usuario } = req.headers, 
            funcionario = await isFuncionario(id_estabelecimento, id_usuario),
            response = null

        if(funcionario){
            let conta = await Conta.findOne({nome_cliente})
            if(conta){
                response  = { error: "Conta já existe"}
            } else {
                response = await Conta.create(novaConta)
            }
        }
        
        return res.json(response)
    },
    async destroy(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            response = null,
            temPermissaoDeAdministrador = await isAdministrador(id_estabelecimento, id_usuario)
            
        if(temPermissaoDeAdministrador){
            response = await Conta.findOneAndDelete({_id: req.query.id_conta})
        } else {
            response = { Error: "Usuário não autorizado" } 
        }
        return res.json(response)
    },
    async update(req, res){
        let contaParaAtualizar = { nome_cliente, dt_pagamento, valor_pago, pago, desconto, listItems } = req.body,
            { id_conta_editar } = req.params,
            { id_estabelecimento, id_usuario } = req.headers,
            funcionario = await isFuncionario(id_estabelecimento, id_usuario),
            response = null
        
        if(funcionario){
            response = await Conta.findByIdAndUpdate({_id: id_conta_editar}, contaParaAtualizar, {new:true})
        } else {
            response = { Error: "Usuário não autorizado" }
        }
        return res.json(response)
    },
    async show(req, res){
        let response = await Conta.find({})
        return res.json(response)
    }
}

