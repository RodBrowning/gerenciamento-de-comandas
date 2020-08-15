// index, show, store, update, destroy. 
const Acompanhamento = require("../../Models/Acompanhamento")
const Estabelecimento = require("../../Models/Estabelecimento")
const Cardapio = require("../../Models/Cardapio")

module.exports = {
    async store(req, res) {
        let novoAcompanhamento  = { nome_acompanhamento, preco, tipo_acompanhamento } = req.body,
            { id_estabelecimento } = req.headers,
            response = null,
            estabelecimento = null,
            acompanhamentoEncontrado = false,
            statusCode = 200

        estabelecimento = await Estabelecimento.findOne({_id:id_estabelecimento})
        .populate({path: 'acompanhamentos', model: 'Acompanhamento'})
        
        acompanhamentoEncontrado = estabelecimento.acompanhamentos.some(acompanhamento=> acompanhamento.nome_acompanhamento === nome_acompanhamento)

        // acompanhamentoEncontrado = estabelecimento.cardapio.acompanhamentos.find(acompanhamento=> acompanhamento.nome_acompanhamento === nome_acompanhamento)
        if(acompanhamentoEncontrado){
            response = { Error: "O acompanhamento já existe" }
            statusCode = 400
        } else {
            response = await Acompanhamento.create(novoAcompanhamento)
            await Estabelecimento.findByIdAndUpdate({_id: estabelecimento._id},{$push: {acompanhamentos: response._id}},{new:true})
        }
        return res.status(statusCode).json(response)
    },
    async destroy(req, res){
        let response = null,
            { id_acompanhamento_remover, id_cardapio } = req.params,
            { id_estabelecimento } = req.headers,
            statusCode = 200
            cardapios = null
        
        response =  await Estabelecimento.findByIdAndUpdate({_id: id_estabelecimento}, {$pull: {acompanhamentos: id_acompanhamento_remover}}, {new:true})

        response.cardapios.forEach(async cardapio_id =>{
            return await Cardapio.findByIdAndUpdate({_id: cardapio_id}, {$pull: {acompanhamentos: id_acompanhamento_remover}}, {new:true})
        })
        
        return res.status(statusCode).json(response)
    },
    async update(req, res){
        let acompanhamentoAtualizado  = { nome_acompanhamento, preco, categoria, tipo, com_preparo, departamentos, ex_dicas } = req.body,
            { id_acompanhamento_editar } = req.params,
            statusCode = 200,
            response = null
        
        response = await Acompanhamento.findByIdAndUpdate({_id: id_acompanhamento_editar}, acompanhamentoAtualizado, {new:true})
        return res.status(statusCode).json(response)
    },
    async show(req, res){
        let response = null,
            { id_estabelecimento } = req.headers,
            statusCode = 200
        
        estabelecimento = await Estabelecimento.findOne({_id:id_estabelecimento})
        .populate({path: 'id_cardapio_ativo', model: 'Cardapio', populate: {path: 'acompanhamentos', model: 'Acompanhamento'}})

        response = estabelecimento.cardapio.acompanhamentos
        return res.status(statusCode).json(response)
    },
    async index(req, res){
        let { id_acompanhamento_buscar } = req.params,
            { id_estabelecimento } = req.headers,
            statusCode = 200,
            acompanhamentoBuscado = null

        estabelecimento = await Estabelecimento.findOne({_id:id_estabelecimento})
        .populate({path: 'id_cardapio_ativo', model: 'Cardapio', populate: {path: 'acompanhamentos', model: 'Acompanhamento'}})
        
        estabelecimento.id_cardapio_ativo.acompanhamentos.map(acompanhamento=>{
            if(acompanhamento._id.equals(id_acompanhamento_buscar)){
                acompanhamentoBuscado = acompanhamento
            }
        })

        if(acompanhamentoBuscado){
            response = acompanhamentoBuscado
        } else {
            response = { Error: "Acompanhamento não encontrado no cardápio" }
            statusCode = 400
        }
        
        return res.status(statusCode).json(response)
    }
}