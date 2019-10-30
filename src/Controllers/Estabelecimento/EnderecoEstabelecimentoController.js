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
        let { id_endereco_atualuzar, id_usuario } = req.headers,
            enderecoAtualizar = {rua, numero, bairro, CEP, estado, uf, cidade, pais} = req.body,
            response = null

        if(await isAdministrador(id_endereco_atualuzar,id_usuario)){
            response = await Endereco.findOneAndUpdate({_id: id_endereco_atualuzar}, enderecoAtualizar)
        } else {
            response = {Error: "Usuario não autorizado"}
        }
        return res.json(response)
    }
}