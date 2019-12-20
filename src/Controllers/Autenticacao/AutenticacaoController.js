// index, show, store, update, destroy.  
const Autenticacao = require('../../Models/Autenticacao')

const Endereco = require('../../Models/Endereco')
const Estabelecimento = require('../../Models/Estabelecimento')
const Usuario = require('../../Models/Usuario')
const Cardapio = require('../../Models/Cardapio')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const { enviarEmailDeConfirmacao } = require('../../Services/EmailDeConfirmacao')

module.exports = {
    async singin(req, res){
        let novaAutenticacao = { email, password, estabelecimento, endereco, usuarios} = req.body,
            saltRounds = 10,
            response = {},
            novoEndereco = {},
            novoEstabelecimento = null,
            novoUsuario = null,
            novoCardapio = null
            
        
        let hashPassword = bcrypt.hashSync(novaAutenticacao.password, saltRounds)
        novaAutenticacao.password = hashPassword
       

        // criar endereco
        novoEndereco = novaAutenticacao.endereco
        novoEndereco = await Endereco.create(novoEndereco)
        novaAutenticacao.estabelecimento.endereco = novoEndereco._id
        // criar estabelecimento
        novoEstabelecimento = novaAutenticacao.estabelecimento
        novoEstabelecimento = await Estabelecimento.create(novoEstabelecimento)
        // criar usuario
        novaAutenticacao.usuarios.estabelecimentos = novoEstabelecimento._id
        novoUsuario = novaAutenticacao.usuarios
        novoUsuario = await Usuario.create(novoUsuario)

        // criar cardapio padrao
        novoCardapio = await Cardapio.create({estabelecimentos: [novoEstabelecimento._id]})
        
        // atualizar estabelecimento com usuario e cardapio
        novoEstabelecimento = await Estabelecimento.findByIdAndUpdate({_id: novoEstabelecimento._id}, {$set:{usuarios: novoUsuario._id, cardapio: novoCardapio._id}},{new:true})

        // criar autenticacao
        novaAutenticacao.id_usuario = novoUsuario._id
        novaAutenticacao.dono = true
        novaAutenticacao = await Autenticacao.create(novaAutenticacao)

        let emailToken = enviarEmailDeConfirmacao(novoUsuario._id, novaAutenticacao.email)

        novaAutenticacao = await Autenticacao.findByIdAndUpdate({_id: novaAutenticacao._id},{$set:{emailToken}},{new:true})
        novoUsuario = await Usuario.findByIdAndUpdate({_id: novoUsuario._id}, {$set: {autenticacao: novaAutenticacao._id}},{new:true})
        response = novoUsuario
        if(process.env.NODE_ENV === 'test'){
            response  = Object.assign({},novaAutenticacao._doc,{emailToken: emailToken, id_estabelecimento: novoEstabelecimento._id})
        }
        
        res.json(response)
        
    },
    async validarUsuario(req, res){
        let response= null,
            { email, emailToken } = req.params,
            tokenEncontrado = false,
            statusCode = 200,
            autenticacaoEncontrada = null

        autenticacaoEncontrada = await Autenticacao.findOne({email})
        
        if(autenticacaoEncontrada){
            tokenEncontrado = jwt.verify(emailToken, email,(err, token)=>{
                if(err){
                    return false
                } else {
                    return true
                }
            })
            if(tokenEncontrado){
                let usuarioValidado = await Autenticacao.findByIdAndUpdate({_id:autenticacaoEncontrada._id},{$set:{validado: true}}, {new:true})
                response = usuarioValidado    
                statusCode = 200
            } else {
                statusCode = 403
                response = {Error: 'Token invalido'}
            }
        } else {
            statusCode = 500
            response = {Error: 'Email não encontrado'}
        }
        return res.status(statusCode).json(response) 
    },
    async login(req, res){
        let { password } = req.headers,
            { email } = req.query,
            response = null,
            statusCode = 200,
            usuario = await Autenticacao.findOne({ email })
        
        if(usuario){
            if(usuario.logado || usuario.bloqueado || !usuario.validado){
                response = {Error: "Ocorreu um erro, entre em contato com seu administrador"}
                statusCode = 403
            } else {
                let passwordEstaCorreto = await bcrypt.compare(password, usuario.password)
                if(passwordEstaCorreto){
                    let autenticacao = await Autenticacao.findByIdAndUpdate({_id: usuario._id},{$set: { logado: true}},{new:true}).select("-password").populate("id_usuario")
                        privateKey = fs.readFileSync(path.resolve(__dirname,"..","..","public.pem"))
                        token = jwt.sign({autenticacao}, privateKey, {expiresIn: "1 days"}, {algorithm: 'RS256'})
                    if(process.env.NODE_ENV === 'test'){
                        response = {token, autenticacao}
                    } else {
                        response  = {Msg: "Usuario logado com sucesso"}
                    }
                } else {
                    response = {Error: "Password invalido"}
                    statusCode = 403
                }
            }
        } else {
            response = {Error: "Usuario não encontrado"}
            statusCode = 500
        }
        return res.status(statusCode).json(response)
    },
    async logout(req,res){
        let { id_usuario } = req.headers,
            response = null,
            statusCode = 200,
            usuario  = await Usuario.findOne({_id: id_usuario})
        
        if(usuario){
            response = await Autenticacao.findByIdAndUpdate({_id: usuario.autenticacao},{$set: {logado: false}}, {new:true})
        } else {
            response = { Error: "Usuario não encontrado"}
            statusCode = 500
        }
        return res.status(statusCode).json(response)
    }
}
