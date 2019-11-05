// index, show, store, update, destroy.  
const Estabelecimento = require('../../Models/Estabelecimento')
const Usuario = require('../../Models/Usuario')
const { isAdministrador, isFuncionario } = require('../../Services/VerificacoesDeSistema')

module.exports = {
    async store(req, res){
        let novoEstabelecimento = { nome, telefone, endereco, contas, usuarios, cardapio } = req.body
        let estabelecimento = await Estabelecimento.findOne({ nome: novoEstabelecimento.nome })
        
        if (!estabelecimento) {
            estabelecimento = await Estabelecimento.create(novoEstabelecimento)
        }
        return res.json(estabelecimento)
    },
    async update(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            estabelecimentoParaAtualizar = { nome, telefone, endereco, contas, usuarios, cardapio } = req.body,
            response = null
                
        if(await isAdministrador(id_estabelecimento,id_usuario)){
            response = await Estabelecimento.findOneAndUpdate({_id: id_estabelecimento}, estabelecimentoParaAtualizar, {new:true})
        } else {
            response = {Error: "Usuario não autorizado"}
        }
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
            { estabelecimentos } = await Usuario.findOne({_id: id_usuario}, {_id: 0, estabelecimentos: 1}),
            response  = null
            
        // buscar os estabelecimentos do usuario corrente
        if(estabelecimentos){
            response = await Estabelecimento.find({_id: estabelecimentos})
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
                        path: "id_lancamentoListItem",
                        model: "LancamentoListItem"
                    }
                }
            })
            .populate({
                path:"cardapio", 
                model: "Cardapio",
                populate: {path: "items", model: "Item"}
            })
        } else {
            response = { Error: "Usuario não encontrado"}
        }
        return res.json(response)
    },
    async index(req, res){
        let response = null
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
                    path: "id_lancamentoListItem",
                    model: "LancamentoListItem"
                }
            }
        })
        .populate({
            path:"cardapio", 
            model: "Cardapio",
            populate: {path: "items", model: "Item"}
        })
            
        return res.json(response)
    }

}