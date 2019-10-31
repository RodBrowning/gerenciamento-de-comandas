// index, show, store, update, destroy.  
const Autenticacao = require('../../Models/Autenticacao')
const Usuario = require('../../Models/Usuario')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    async singin(req, res){
        let novaAutenticacao = {id_usuario, email, password, validado, bloqueado, logado} = req.body,
            saltRounds = 10,
            response = null,
            emailsEncontrados = await Autenticacao.find({email: novaAutenticacao.email})
            
        if(emailsEncontrados.length > 0){
            response = { Error: "Usuario ja existe"}
        } else {
            await bcrypt.genSalt(saltRounds, async function(err, salt) {
                if(!err){ 
                    await bcrypt.hash(novaAutenticacao.password, salt, async function(err, hashPassword) {
                        if(err){
                        } else {
                            novaAutenticacao.password = hashPassword
                            response = await Autenticacao.create(novaAutenticacao)                              
                            return res.json(response)
                        }
                    });
                } else {
                    return res.send(err)
                }
            })
        }
    },
    async login(req, res){
        let { password } = req.headers,
            { email } = req.query,
            response = null,
            usuario = await Autenticacao.findOne({ email })
        
        if(usuario){
            let passwordEstaCorreto = bcrypt.compare(password, usuario.password)
            if(passwordEstaCorreto && !usuario.logado){
                let autenticacao = await Autenticacao.findByIdAndUpdate({_id: usuario._id},{$set: { logado: true}},{new:true})
                let secretKey = "sha num arquivo"
                return jwt.sign({autenticacao}, "teste", { expiresIn: "30m" }, (err, token)=>{
                    if(err){
                        return err
                    } else {                    
                        return res.json({token})
                    }
                })
            } else if(usuario.logado){
                response = {Error: "Usuario esta logado"}
            } else {
                response = {Error: "Password invalido"}
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
