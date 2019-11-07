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
        
        //////////////////
        //retirar
        if(process.env.NODE_ENV === 'test'){
            novaAutenticacao.validado = true
        }
        /////////////////

        novaAutenticacao = await Autenticacao.create(novaAutenticacao)

        let emailToken = jwt.sign({user: novoUsuario._id},novaAutenticacao.email,{expiresIn: "1d"})

        let url = `http://localhost:2000/validacaoDeUsuario/${novaAutenticacao.email}/${emailToken}`,
        mailOptions = {
            from: 'rodrigo.lojaonline@gmail.com',
            to: novaAutenticacao.email,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
        },
        { Transporter } = require('./CredenciaisDeEmail')
        Transporter.sendMail(mailOptions,function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                
            }
        });

        novaAutenticacao = await Autenticacao.findByIdAndUpdate({_id: novaAutenticacao._id},{$set:{emailToken}})
        
        response.autenticacao = novaAutenticacao
        response.token = emailToken
        res.json(response)
        
    },
    async validarUsuario(req, res){
        let response= null,
            { email, emailToken } = req.params,
            tokenEncontrado = false,
            autenticacaoEncontrada = null

        autenticacaoEncontrada = await Autenticacao.findOne({email})
        
        if(autenticacaoEncontrada){
            tokenEncontrado = jwt.verify(emailToken, email)
            if(tokenEncontrado){
                let usuarioValidado = await Autenticacao.findByIdAndUpdate({_id:autenticacaoEncontrada._id},{$set:{validado: true}}, {new:true})
                response = usuarioValidado    
            } else {
                response = { Error: "token invalido"}
            }
        } else {
            response = { Error: "token não encontrado"}
        }
        res.json(response) 
    },
    async login(req, res){
        let { password } = req.headers,
            { email } = req.query,
            response = null,
            usuario = await Autenticacao.findOne({ email })
        
        if(usuario){
            if(usuario.logado || usuario.bloqueado || !usuario.validado){
                response = {Error: "Ocorreu um erro, entre em contato com seu administrador"}
            } else {
                let passwordEstaCorreto = await bcrypt.compare(password, usuario.password)
                if(passwordEstaCorreto){
                    let autenticacao = await Autenticacao.findByIdAndUpdate({_id: usuario._id},{$set: { logado: true}},{new:true})
                        privateKey = fs.readFileSync(path.resolve(__dirname,"..","..","public.pem"))
                        token = jwt.sign({autenticacao}, privateKey, {expiresIn: "1 days"}, {algorithm: 'RS256'})
                    response = {token}
                } else {
                    response = {Error: "Password invalido"}
                }
            }
        } else {
            response = {Error: "Usuario não encontrado"}
        }
        return res.json(response)
    },
    async logout(req,res){
        let { id_usuario } = req.headers,
            response = null,
            user  = await Usuario.findOne({_id: id_usuario})

        if(user){
            response = await Autenticacao.findByIdAndUpdate({_id: user.autenticacao},{$set: {logado: false}}, {new:true})
        } else {
            response = { Error: "Usuario não encontrado"}
        }
        return res.json(response)
    }
}
