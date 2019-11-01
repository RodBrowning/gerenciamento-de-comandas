// index, show, store, update, destroy.  
const Endereco = require('../../Models/Endereco')

module.exports = {
    async store(req, res){
        let novoEndereco = {rua, numero, bairro, CEP, estado, uf, cidade, pais} = req.body
        let endereco = await Endereco.findOne({CEP, numero})
        if(!endereco){
            endereco = await Endereco.create(novoEndereco)
        }
        return res.json(endereco)
    },
    async update(req, res){
        let { id_endereco_atualuzar } = req.headers,
            enderecoAtualizar = {rua, numero, bairro, CEP, estado, uf, cidade, pais} = req.body,
            response = null

        response = await Endereco.findOneAndUpdate({_id: id_endereco_atualuzar}, enderecoAtualizar)
        return res.json(response)
    }
}