// index, show, store, update, destroy. 
const Item = require("../../Models/Item")
const Estabelecimento = require("../../Models/Estabelecimento")
const Cardapio = require("../../Models/Cardapio")

module.exports = {
    async store(req, res) {
        let novoItem  = { nome_item, preco, categoria, tipo, com_preparo, departamentos, ex_dicas } = req.body,
            { id_estabelecimento } = req.headers,
            response = null,
            estabelecimento = null,
            itemEncontrado = false,
            statusCode = 200

        estabelecimento = await Estabelecimento.findOne({_id: id_estabelecimento})
        .populate({path: 'items', model: 'Item'})

        itemEncontrado = estabelecimento.items.some(item=> item.nome_item === nome_item)
        
        // itemEncontrado = estabelecimento.cardapio.items.find(item=> item.nome_item === nome_item)
        if(itemEncontrado){
            response = { Error: "O item já existe" }
            statusCode = 400
        } else {
            response = await Item.create(novoItem)
            await Estabelecimento.findByIdAndUpdate({_id: estabelecimento._id},{$push: {items: response._id}},{new:true})
        }
        
        return res.status(statusCode).json(response)
    },
    async update(req, res){
        let itemAtualizado  = { nome_item, preco, categoria, tipo, com_preparo, departamentos, ex_dicas } = req.body,
            { id_item_editar } = req.params,
            statusCode = 200,
            response = null
        
        response = await Item.findByIdAndUpdate({_id: id_item_editar}, itemAtualizado, {new:true})
        return res.status(statusCode).json(response)
    },
    async destroy(req, res){
        let response = null,
            { id_item_remover } = req.params,
            { id_estabelecimento } = req.headers,
            statusCode = 200
            cardapios = null
            id_cardapio = null
        
        response = await Estabelecimento.findByIdAndUpdate({_id: id_estabelecimento}, {$pull: {items: id_item_remover}}, {new:true})
        
        response.cardapios.forEach(async cardapio_id =>{
            return await Cardapio.findByIdAndUpdate({_id: cardapio_id}, {$pull: {items: id_item_remover}}, {new:true})
        })
        
        return res.status(statusCode).json(response)
    },
    async show(req, res){
        let response = null,
            { id_estabelecimento } = req.headers,
            statusCode = 200
        
        estabelecimento = await Estabelecimento.findOne({_id:id_estabelecimento})
        .populate({path: 'items', model: 'Item'})

        response = estabelecimento.items
        return res.status(statusCode).json(response)
    },
    async index(req, res){
        let { id_item_buscar } = req.params,
            { id_estabelecimento } = req.headers,
            statusCode = 200,
            itemBuscado = null

        estabelecimento = await Estabelecimento.findOne({_id:id_estabelecimento})
        .populate({path: 'items', model: 'Item'})
        
        estabelecimento.items.map(item=>{
            if(item._id.equals(id_item_buscar)){
                itemBuscado = item
            }
        })

        if(itemBuscado){
            response = itemBuscado
        } else {
            response = { Error: "Item não encontrado no cardápio"}
            statusCode = 400
        }
        
        return res.status(statusCode).json(response)
    }
}