const Autenticacao = require('../../Models/Autenticacao')
const Usuario = require('../../Models/Usuario')

module.exports = {
    async bloquearUsuario(req, res){
        let response = null,
            statusCode = 200,
            usuario_para_bloquear = null,
            { id_usuario_bloquear } = req.params
        usuario_para_bloquear = await Usuario.findOne({_id: id_usuario_bloquear})
        if(id_usuario_bloquear === req.headers.id_usuario){
            response = { Error: "Não é permitido auto bloqueio" }
            statusCode = 500
        } else if(usuario_para_bloquear){
            response  = await Autenticacao.findByIdAndUpdate({_id: usuario_para_bloquear.autenticacao}, {bloqueado: true, logado: false}, {new:true})
        } else {
            response = { Error: "Usuario informado não foi encontrado" }
            statusCode = 500
        }
        return res.status(statusCode).json(response)
    },
    async desbloquearUsuario(req, res){
        let response = null,
            statusCode = 200,
            usuario_para_desbloquear = null,
            { id_usuario_desbloquear } = req.params
        
        usuario_para_desbloquear = await Usuario.findOne({_id: id_usuario_desbloquear})
        response  = await Autenticacao.findOneAndUpdate({_id: usuario_para_desbloquear.autenticacao}, {bloqueado:false}, {new:true})
        return res.status(statusCode).json(response)
    }
}