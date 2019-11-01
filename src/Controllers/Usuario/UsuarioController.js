// index, show, store, update, destroy.  
const Usuario = require('../../Models/Usuario')
const { isAdministrador } = require('../../Services/VerificacoesDeSistema')

module.exports = {
    async store (req, res){
        let novoUsuario = { nome, dt_nascimento, estabelecimentos } = req.body,
            usuario = await Usuario.findOne({nome})

        if(!usuario){
            usuario = await Usuario.create(novoUsuario)
        }
        return res.json(usuario)
    },
    async destroy(req, res){
        let { id_usuario } = req.headers,
            { id_usuario_deletar } = req.params,
            usuarioEstaAutorizado = false,
            response = null
        
        if(id_usuario !== id_usuario_deletar){
            usuarioEstaAutorizado = true;
        }
        if(usuarioEstaAutorizado){
            response = await Usuario.findByIdAndDelete({_id: id_usuario_deletar})
        } else {
            response = {Error: "Usuário não autorizado"}
        }
        return res.json(response)
    },
    async update(req, res){
        let usuarioParaAtualizar = { nome, dt_nascimento, estabelecimentos } = req.body,
            { id_usuario_editar } = req.params,
            response = null

        response = await Usuario.findByIdAndUpdate({_id: id_usuario_editar}, usuarioParaAtualizar, {new:true})
        return res.json(response)
    },
    async show(req, res){
        let response = null
        response  = await Usuario.find({})
        return res.json(response)
    },
    async index(req, res){
        let { id_usuario } = req.headers,
            { id_usuario_buscar } = req.params,
            response = null
            proprioPerfil = (id_usuario === id_usuario_buscar) 
        
        if( proprioPerfil ){
            response = await Usuario.findOne({_id: id_usuario_buscar})
        } else {
            response = { Error: "Usuário não autorizado" }
        }
        return res.json(response)
    }
}