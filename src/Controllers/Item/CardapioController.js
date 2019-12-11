const Estabelecimento = require('../../Models/Estabelecimento')
const Cardapio = require("../../Models/Cardapio")

module.exports = {
    async store(req, res){
        let novoCardapio = { nome_cardapio, listItems, estabelecimentos } = req.body,
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
        }
        
        return res.status(statusCode).json(response)
    },
    async update(req, res){
        let cardapioAtualizar = { nome_cardapio, listItems, estabelecimentos } = req.body,
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
        cardapioAtivo = estabelecimento.cardapio.equals(id_cardapio_remover)

        cardapio = await Cardapio.findById({_id: id_cardapio_remover})
        cardapioPertenceAoEstabelecimento = cardapio.estabelecimentos.includes(id_estabelecimento) ? true : false
        algumEstabelecimentoDependeDesseCardapio = cardapio.estabelecimentos.length > 1 ? true : false

        if(cardapioAtivo){
            response = {Error: "Não é possivel remover um cardapio ativo"}
            statusCode = 400
        } else if(algumEstabelecimentoDependeDesseCardapio){
                let indexDoEstabelecimento = cardapio.estabelecimentos.indexOf(id_estabelecimento),
                    novaListaDeEstabelecimentos =  null

                cardapio.estabelecimentos.splice(indexDoEstabelecimento,1)
                novaListaDeEstabelecimentos =  cardapio.estabelecimentos
                response  = await Cardapio.findByIdAndUpdate({_id: id_cardapio_remover}, {estabelecimentos:novaListaDeEstabelecimentos},{new:true})
        } else {
            response = await Cardapio.findByIdAndDelete({_id: id_cardapio_remover})
        }
    

        return res.status(statusCode).json(response)
    },
    async index(req, res){
        let response = null,
            {id_cardapio} = req.params
        
        response  = await Cardapio.findById({_id: id_cardapio})
        .populate({
            path:"items",
            model: "Item"
        })
        return res.json(response)
    },
    async show(req, res){
        let response = null,
            {id_estabelecimento} =req.headers
        
        response = await Cardapio.find({estabelecimentos: id_estabelecimento})
        .populate({
            path:"items",
            model:"Item"
        })
        
        return res.json(response)
    }
}