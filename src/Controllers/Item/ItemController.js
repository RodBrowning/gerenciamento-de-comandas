// index, show, store, update, destroy. 
const Item = require("../../Models/Item")

module.exports = {
    async store(req, res) {
        let novoItem  = { nome_item, preco } = req.body,
            response = null

        let item = await Item.findOne({nome_item})
        if(item){
            response = { Error: "O item já existe" }
        } else {
            response = await Item.create(novoItem)
        }

        return res.json(response)
    },
    async destroy(req, res){
        let response = null
        response = await Item.deleteOne({_id: req.query.id_item})
        return res.json(response)
    },
    async update(req, res){
        let itemAtualizado  = { nome_item, preco } = req.body,
            { id_item_editar } = req.params,
            response = null
        response = await Item.findByIdAndUpdate({_id: id_item_editar}, itemAtualizado, {new:true})
        return res.json(response)
    },
    async show(req, res){
        let response = await Item.find({})
        return res.json(response)
    },
    async index(req, res){
        let { id_item_buscar } = req.params,
            response = await Item.findOne({_id:id_item_buscar})
        return res.json(response)
    }
}