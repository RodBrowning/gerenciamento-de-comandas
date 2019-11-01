// index, show, store, update, destroy.  
const Autenticacao = require('../../Models/Autenticacao')
const Usuario = require('../../Models/Usuario')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

module.exports = {
    async singin(req, res){
        let novaAutenticacao = {id_usuario, email, password, validado, bloqueado, logado} = req.body,
            saltRounds = 10,
            response = null
            emailFoiEncontrado = await Autenticacao.findOne({email: novaAutenticacao.email})
        
        if(emailFoiEncontrado){
            response = { Error: "Usuario ja existe"}
            res.json(response)
        } else {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(!err){ 
                    bcrypt.hash(novaAutenticacao.password, salt, async function(err, hashPassword) {
                        if(err){
                            response = {Error: err}
                            res.json(response)
                        } else {
                            novaAutenticacao.password = hashPassword
                            response = await Autenticacao.create(novaAutenticacao)
                            res.json(response)
                        }
                    });
                } else {
                    response = {Error: err}
                    res.json(response)
                }
            })
        }
    },
    async login(req, res){
        let { password } = req.headers,
            { email } = req.query,
            response = null,
            usuario = await Autenticacao.findOne({ email })
        // falta verificar se é bloqueado e validado
        if(usuario){
            if(usuario.logado){
                response = {Error: "Usuario esta logado"}
            } else {
                let passwordEstaCorreto = await bcrypt.compare(password, usuario.password)
                if(passwordEstaCorreto){
                    let autenticacao = await Autenticacao.findByIdAndUpdate({_id: usuario._id},{$set: { logado: true}},{new:true})
                        privateKey = fs.readFileSync(path.resolve(__dirname,"..","..","public.pem"))
                        token = jwt.sign({autenticacao}, privateKey, {expiresIn: "30m"}, {algorithm: 'RS256'})
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
