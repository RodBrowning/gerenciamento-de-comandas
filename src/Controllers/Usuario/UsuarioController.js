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
        let { id_estabelecimento, id_usuario } = req.headers,
            { id_usuario_deletar } = req.params,
            usuarioEstaAutorizado = false,
            response = null,
            temPermissaoDeAdministrador = await isAdministrador(id_estabelecimento, id_usuario)
        
        if(temPermissaoDeAdministrador && (id_usuario !== id_usuario_deletar)){
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
            { id_estabelecimento, id_usuario } = req.headers,
            { id_usuario_editar } = req.params,
            response = null,
            administrador = await isAdministrador(id_estabelecimento, id_usuario)

        if(administrador){
            response = await Usuario.findByIdAndUpdate({_id: id_usuario_editar}, usuarioParaAtualizar, {new:true})
        } else {
            response = { Error: "Usuário não autorizado" }
        }
        
        return res.json(response)
    },
    async show(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            response = null,
            administrador = await isAdministrador(id_estabelecimento, id_usuario)

        if(administrador){
            response  = await Usuario.find({})
        } else {
            response = { Error: "Usuário não autorizado"}
        }
        return res.json(response)
    },
    async index(req, res){
        let { id_estabelecimento, id_usuario } = req.headers,
            { id_usuario_buscar } = req.params,
            response = null,
            administrador = await isAdministrador(id_estabelecimento, id_usuario),
            proprioPerfil = (id_usuario === id_usuario_buscar) 
        
        if( administrador || proprioPerfil ){
            
            response = await Usuario.findOne({_id: id_usuario_buscar})
        } else {
            response = { Error: "Usuário não autorizado" }
        }
        return res.json(response)
    }
}