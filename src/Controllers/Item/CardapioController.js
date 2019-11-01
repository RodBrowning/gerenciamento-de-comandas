const Cardapio = require("../../Models/Cardapio")

module.exports = {
    async store(req, res){
        let novoCardapio = { nome_cardapio, listItems, estabelecimentos } = req.body,
            response = null

        response = await Cardapio.create(novoCardapio)
        return res.json(response)
    },
    async update(req, res){
        let cardapioAtualizar = { nome_cardapio, listItems, estabelecimentos } = req.body,
            { id_cardapio } = req.query,
            response = null

        response = await Cardapio.findOneAndUpdate({_id:id_cardapio}, cardapioAtualizar, {new:true})
        return res.json(response)
    }
}