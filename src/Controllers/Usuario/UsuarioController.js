// index, show, store, update, destroy.  
const Usuario = require('../../Models/Usuario')
const Autenticacao = require('../../Models/Autenticacao')
const Estabelecimento = require('../../Models/Estabelecimento')
const bcrypt = require('bcrypt')
const { enviarEmailDeConfirmacao } = require('../../Services/EmailDeConfirmacao')

module.exports = {
    async store (req, res){
        let response = null,
            statusCode = 200,
            saltRounds = 10,
            { email, role } = req.body,
            novoUsuario = { nome, dt_nascimento, telefones, departamentos, estabelecimentos } = req.body,
            usuarioEncontrado = await Autenticacao.findOne({email})
            

        if(usuarioEncontrado){
            response = { Error: "Usuario já existe"}
            statusCode = 400
        } else {
            let hashPassword = bcrypt.hashSync(req.body.password, saltRounds)
            let usuarioCriado = await Usuario.create(novoUsuario)

            let novaAutenticacaoBody = { 
                id_usuario: usuarioCriado._id,
                email,
                password: hashPassword,
                role
            }
            let novaAutenticacao = await Autenticacao.create(novaAutenticacaoBody)
            
            let estabelecimento = await Estabelecimento.findByIdAndUpdate({_id: req.headers.id_estabelecimento}, {$push: {usuarios: usuarioCriado._id}}, {new:true})
            let usuario = await Usuario.findByIdAndUpdate({_id: usuarioCriado._id},{$set:{autenticacao: novaAutenticacao._id}},{new:true})
            
            let emailToken = enviarEmailDeConfirmacao(usuarioCriado._id, novaAutenticacao.email)

            let autenticacao = Object.assign({},novaAutenticacao._doc,{emailToken})
            
            if(process.env.NODE_ENV == 'test'){
                response = {usuario,autenticacao,estabelecimento}
            } else {
                response = usuario
            }
        }
        
        return res.status(statusCode).json(response)
    },
    async destroy(req, res){
        let { id_usuario } = req.headers,
            { id_usuario_deletar } = req.params,
            usuario = null,
            usuarioEstaAutorizado = false,
            response = null,
            statusCode = 200
        
        if(id_usuario !== id_usuario_deletar){
            usuarioEstaAutorizado = true;
        }
        if(usuarioEstaAutorizado){
            usuario = await Usuario.findById({_id: id_usuario_deletar})
            await Estabelecimento.findOneAndUpdate({_id: usuario.estabelecimentos}, {$pull: {usuarios: id_usuario_deletar}})
            response = await Usuario.findByIdAndDelete({_id: id_usuario_deletar})
        } else {
            response = {Error: "Operação não autorizada"}
            statusCode = 500
        }
        return res.status(statusCode).json(response)
    },
    async update(req, res){
        let usuarioParaAtualizar = { nome, dt_nascimento, telefones, estabelecimentos, departamentos } = req.body,
            dadosDeAutenticacaoParaAtualizar = { email, password } = req.body,
            { id_usuario_editar } = req.params,
            response = null,
            saltRounds = 10

        let hashPassword = bcrypt.hashSync(dadosDeAutenticacaoParaAtualizar.password, saltRounds)
        dadosDeAutenticacaoParaAtualizar.password = hashPassword
        
        usuarioAtualizado = await Usuario.findByIdAndUpdate({_id: id_usuario_editar}, usuarioParaAtualizar, {new:true})
        autenticacaoAtualizada = await Autenticacao.findOneAndUpdate({_id: usuarioAtualizado.autenticacao}, dadosDeAutenticacaoParaAtualizar,{new:true})
        if(process.env.NODE_ENV === 'test'){
            response = {usuarioAtualizado,autenticacaoAtualizada}
        } else {
            response = usuarioAtualizado
        }
        return res.json(response)
    },
    async show(req, res){
        let response = null,
            estabelecimento = null,
            statusCode = 200

        estabelecimento = await Estabelecimento.findOne({_id: req.headers.id_estabelecimento})
        response  = await Usuario.find({_id: estabelecimento.usuarios})
        .populate({path:'autenticacao', model: 'Autenticacao', select: {password: 0, _id: 0, __v: 0, id_usuario: 0}})
        
        return res.status(statusCode).json(response)
    },
    async index(req, res){
        let { id_usuario } = req.headers,
            { id_usuario_buscar } = req.params,
            response = null,
            statusCode = 200,
            proprioPerfil = (id_usuario === id_usuario_buscar) 
        
        if( proprioPerfil ){
            response = await Usuario.findOne({_id: id_usuario_buscar})
            .populate({path:'autenticacao', model: 'Autenticacao', select: {password: 0, _id: 0, __v: 0, id_usuario: 0}})
            
        } else {
            response = { Error: "Usuário não autorizado" }
            statusCode = 500
        }
        return res.status(statusCode).json(response)
    }
}