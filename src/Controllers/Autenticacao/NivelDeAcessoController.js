const Autenticacao = require('../../Models/Autenticacao')
const Usuario = require('../../Models/Usuario')

module.exports = {
    async alterarNivelDeAcesso(req, res){
        let response = null,
            statusCode = 200,
            { role } = req.body,
            { id_usuario_alterar } = req.params,
            usuario_alterar = await Usuario.findOne({_id: id_usuario_alterar})

        response = await Autenticacao.findByIdAndUpdate({_id: usuario_alterar.autenticacao},{$set:{role}},{new:true})
        return res.status(statusCode).json(response)
    }
}