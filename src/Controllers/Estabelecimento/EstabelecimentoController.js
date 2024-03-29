// index, show, store, update, destroy.  
const Estabelecimento = require('../../Models/Estabelecimento')
const Usuario = require('../../Models/Usuario')
const { isAdministrador, isFuncionario } = require('../../Services/VerificacoesDeSistema')

module.exports = {
    async store(req, res){
        let novoEstabelecimento = { nome, telefone, endereco, contas, usuarios, cardapios } = req.body
        let estabelecimento = await Estabelecimento.findOne({ nome: novoEstabelecimento.nome })
        
        if (!estabelecimento) {
            estabelecimento = await Estabelecimento.create(novoEstabelecimento)
        }
        return res.json(estabelecimento)
    },
    async update(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            estabelecimentoParaAtualizar = { nome, telefone, fechado, endereco, contas, usuarios, cardapios, id_cardapio_ativo, items, acompanhamentos } = req.body,
            response = null

        response = await Estabelecimento.findOneAndUpdate({_id: id_estabelecimento}, estabelecimentoParaAtualizar, {new:true})
        
        return res.json(response)
    },
    async destroy(req, res){
        let { id_estabelecimento } = req.headers
            response = null
        response = await Estabelecimento.findOneAndDelete({_id: id_estabelecimento})
        return res.json(response)
    },
    async show(req, res){
        let { id_usuario } = req.headers,
            usuario = await Usuario.findOne({_id: id_usuario}, {_id: 0, estabelecimentos: 1, autenticacao: 1}).populate("autenticacao"),
            response  = null
        
        let query = usuario.autenticacao.role == 2 ? {fechado: false} : {}

        // buscar os estabelecimentos do usuario corrente        
        response = await Estabelecimento.find({_id: usuario.estabelecimentos},query)
        .populate('endereco')
        .populate({
            path: "contas",
            model: "Conta",
            populate: {
                path: "listItems", 
                model: "ListItem",
                populate: {
                    path: "id_item",
                    model: "Item"
                },
                populate: {
                    path: "ids_lancamentoListItem",
                    model: "LancamentoListItem"
                }
            }
        })
        .populate({
            path:"cardapios", 
            model: "Cardapio",
            populate: {path: "items", model: "Item"},
            populate: {path: "acompanhamentos", model: "Acompanhamento"}
        })
        
        return res.json(response)
    },
    async index(req, res){
        let response = null,
            { id_estabelecimento } = req.headers
            
        response = await Estabelecimento.findOne({_id: id_estabelecimento})
        .populate('endereco')
        .populate({
            path: "contas",
            model: "Conta",
            populate: {
                path: "listItems", 
                model: "ListItem",
                populate: {
                    path: "id_item",
                    model: "Item"
                },
                populate: {
                    path: "ids_lancamentoListItem",
                    model: "LancamentoListItem"
                }
            }
        })
        .populate({
            path:"cardapios", 
            model: "Cardapio",
            populate: {path: "items", model: "Item"},
            populate: {path: "acompanhamentos", model: "Acompanhamento"}
        })
            
        return res.json(response)
    }

}