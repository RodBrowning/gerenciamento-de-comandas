const Cardapio = require("../../Models/Cardapio")
const { isAdministrador } = require("../../Services/VerificacoesDeSistema")

module.exports = {
    async store(req, res){
        let { id_estabelecimento, id_usuario} = req.headers,
            novoCardapio = { nome_cardapio, items, estabelecimentos } = req.body,
            administrador = await isAdministrador(id_estabelecimento, id_usuario),
            response = null

        if(administrador){
            response = await Cardapio.create(novoCardapio)
        } else {
            response = { Error: "Usuario não autorizado"}
        }
        return res.json(response)
    },
    async update(req, res){
        let { id_estabelecimento, id_usuario} = req.headers,
            cardapioAtualizar = { nome_cardapio, items, estabelecimentos } = req.body,
            { id_cardapio } = req.query,
            administrador = await isAdministrador(id_estabelecimento, id_usuario),
            response = null

        if(administrador){
            response = await Cardapio.findOneAndUpdate({_id:id_cardapio}, cardapioAtualizar, {new:true})
        } else {
            response = { Error: "Usuario não autorizado"}
        }
        return res.json(response)
    }
}