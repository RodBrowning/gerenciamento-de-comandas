// index, show, store, update, destroy. 
const Item = require("../../Models/Item")
const { isAdministrador } = require('../../Services/VerificacoesDeSistema')

module.exports = {
    async store(req, res) {
        let novoItem  = { nome_item, preco } = req.body,
            { id_estabelecimento, id_usuario } = req.headers,
            response = null,
            naoAdministrador = await isAdministrador(id_estabelecimento, id_usuario)

        if(!naoAdministrador){
            response = { Error: "Usuario não autorizado" }
        }

        let item = await Item.findOne({nome_item})
        if(item){
            response = { Error: "O item já existe" }
        } else {
            response = await Item.create(novoItem)
        }

        return res.json(response)
    },
    async destroy(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            response = null,
            administrador = await isAdministrador(id_estabelecimento, id_usuario)

        if(administrador){
            response = await Item.deleteOne({_id: req.query.id_item})
        } else {
            response = res.json({Error: "Usuário não autorizado"})
        }

        return res.json(response)
    },
    async update(req, res){
        let itemAtualizado  = { nome_item, preco } = req.body,
            { id_item_editar } = req.params,
            { id_estabelecimento, id_usuario } = req.headers,
            response = null,
            administrador = await isAdministrador(id_estabelecimento, id_usuario)

        if(administrador){
            response = await Item.findByIdAndUpdate({_id: id_item_editar}, itemAtualizado, {new:true})
        } else {
            response = res.json({Error: "Usuário não autorizado"})
        }

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