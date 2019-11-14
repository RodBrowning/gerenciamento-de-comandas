// index, show, store, update, destroy.  
const Usuario = require('../../Models/Usuario')
const Autenticacao = require('../../Models/Autenticacao')
const Estabelecimento = require('../../Models/Estabelecimento')
const bcrypt = require('bcrypt')
const { enviarEmailDeConfirmacao } = require('../../Services/EmailDeConfirmacao')

module.exports = {
    async store (req, res){
        let response = null,
            saltRounds = 10,
            { email } = req.body
            novoUsuario = { nome, dt_nascimento, estabelecimentos } = req.body,
            usuario = await Autenticacao.findOne({email})

        if(!usuario){
            let hashPassword = bcrypt.hashSync(req.body.password, saltRounds)
            usuario = await Usuario.create(novoUsuario)

            novaAutenticacao = { 
                id_usuario: usuario._id,
                email: req.body.email,
                password: hashPassword,
                role: req.body.role
            }
            autenticacao = await Autenticacao.create(novaAutenticacao)
            estabelecimento = await Estabelecimento.findByIdAndUpdate({_id: req.headers.id_estabelecimento}, {$push: {usuarios: usuario._id}}, {new:true})
            usuario = await Usuario.findByIdAndUpdate({_id: usuario._id},{$set:{autenticacao: autenticacao._id}},{new:true})

            let emailToken = enviarEmailDeConfirmacao(usuario._id, autenticacao.email)
            autenticacao = Object.assign({},autenticacao._doc,{emailToken})
            
            if(process.env.NODE_ENV == 'test'){
                response = {usuario,autenticacao,estabelecimento}
                
            } else {
                response = usuario
            }
        } else {
            response = { Error: "Usuario já existe"}
        }
        
        return res.json(response)
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
        let response = null,
            estabelecimento = null,
            statusCode = 200
            
        estabelecimento = await Estabelecimento.findOne({_id: req.headers.id_estabelecimento})
        response  = await Usuario.find({_id: estabelecimento.usuarios})
        return res.status(statusCode).json(response)
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