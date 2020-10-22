const Estabelecimento = require('../../Models/Estabelecimento')
const Cardapio = require("../../Models/Cardapio")

module.exports = {
    async store(req, res){
        let novoCardapio = { nome_cardapio, items, acompanhamentos, estabelecimentos } = req.body,
            { id_estabelecimento } = req.headers,
            response = null,
            statusCode = 200,
            cardapios = null,
            cardapioEncontrado = false
        
        cardapios = await Cardapio.find({estabelecimentos: id_estabelecimento})
        cardapioEncontrado = cardapios.find(cardapio => cardapio.nome_cardapio === novoCardapio.nome_cardapio)
        
        if(cardapioEncontrado){
            response = { Error: "O cardápio já existe" }
            statusCode = 400
        } else {
            response = await Cardapio.create(novoCardapio)
            await Estabelecimento.findByIdAndUpdate({_id: id_estabelecimento}, {$push: {cardapios: response._id}}, {new:true})
        }
        
        return res.status(statusCode).json(response)
    },
    async update(req, res){
        let cardapioAtualizar = { nome_cardapio, items, acompanhamentos, estabelecimentos } = req.body,
            { id_cardapio_editar } = req.params,
            response = null
        
        response = await Cardapio.findByIdAndUpdate({_id:id_cardapio_editar}, cardapioAtualizar, {new:true})
        return res.json(response)
    },
    async destroy(req, res){
        let { id_estabelecimento } = req.headers,
            { id_cardapio_remover } = req.params,
            response = null,
            statusCode = 200,
            estabelecimento = null,
            cardapio = null,
            cardapioAtivo = false,
            algumEstabelecimentoDependeDesseCardapio = false

            
        estabelecimento = await Estabelecimento.findById({_id: id_estabelecimento})
        // console.log("estabelecimento.id_cardapio_ativo",estabelecimento.id_cardapio_ativo);
        
        if (estabelecimento.id_cardapio_ativo != null) {
            cardapioAtivo = estabelecimento.id_cardapio_ativo.equals(id_cardapio_remover)
        }

        cardapio = await Cardapio.findById({_id: id_cardapio_remover})
        cardapioPertenceAoEstabelecimento = cardapio.estabelecimentos.includes(id_estabelecimento) ? true : false
        algumEstabelecimentoDependeDesseCardapio = cardapio.estabelecimentos.length > 1 ? true : false
        
        if(cardapioAtivo){
            response = {Error: "Não é possivel remover um cardapio ativo"}
            statusCode = 400
        } else if(algumEstabelecimentoDependeDesseCardapio){
                response  = await Cardapio.findByIdAndUpdate({_id: id_cardapio_remover}, {$pull: {estabelecimentos: id_estabelecimento}},{new:true})
                await Estabelecimento.findByIdAndUpdate({_id: id_estabelecimento}, {$pull: {cardapios: response._id}}, {new:true})
        } else {
            response = await Cardapio.findByIdAndDelete({_id: id_cardapio_remover})
            await Estabelecimento.findByIdAndUpdate({_id: id_estabelecimento}, {$pull: {cardapios: response._id}}, {new:true})
            
        }

        return res.status(statusCode).json(response)
    },
    async index(req, res){
        let response = null,
            statusCode = 200,
            {id_cardapio} = req.params
        
        response  = await Cardapio.findById({_id: id_cardapio})
        .populate({
            path:"items",
            model: "Item"
        })
        .populate({
            path:"acompanhamentos",
            model: "Acompanhamento"
        })
        return res.status(statusCode).json(response)
    },
    async show(req, res){
        let response = null,
            estabelecimento = null,
            statusCode = 200,
            {id_estabelecimento} =req.headers
        
        
        // response = await Cardapio.find({estabelecimentos: id_estabelecimento})
        // .populate({
        //     path:"items",
        //     model:"Item"
        // })
        // .populate({
        //     path:"acompanhamentos",
        //     model: "Acompanhamento"
        // })

        
        response = await Estabelecimento.findById({_id: id_estabelecimento})
        .populate({
            path:"cardapios",
            model:"Cardapio",
            populate: {
                path:"items",
                model:"Item"
            },
            populate: {
                path:"acompanhamentos",
                model: "Acompanhamento"
            }
        })
        
        response = response.cardapios
        return res.status(statusCode).json(response)
    }
}