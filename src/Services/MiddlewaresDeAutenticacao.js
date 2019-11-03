const Autenticacao = require('../Models/Autenticacao')
const Estabelecimento = require('../Models/Estabelecimento')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

module.exports = {
    async verificarSeUsuarioEestabelecimentoExistem(req, res, next){
        let emailFoiEncontrado = false,
            estabelecimentoJaExiste = false
        
        emailFoiEncontrado = await Autenticacao.findOne({email: req.body.email})
        estabelecimentoJaExiste = await Estabelecimento.findOne({nome: req.body.estabelecimento.nome})
        
        if(emailFoiEncontrado){
            response = { Error: "Usuario ja existe"}
            res.json(response)
        } else if(estabelecimentoJaExiste){
            response = { Error: `Um estabelecimento com o nome ${estabelecimentoJaExiste.nome} já existe`}
            res.json(response)
        } else {
            next()
        }
    },
    verificarExistenciaDeToken(req, res, next){
        let bearerHeader = req.headers.autorizacao
        if (typeof bearerHeader !== 'undefined') {
            let bearer = bearerHeader.split(' '),
                bearerToken = bearer[1]
            req.token = bearerToken
            next()
        } else {
            res.status(403).json({Error: "Token não enviado"})
        }
    },
    verificarValidadeDoTokenFornecido(req, res, next){
        let privateKey = fs.readFileSync(path.resolve(__dirname,'..','public.pem'))
        jwt.verify(req.token, privateKey, async (err, authData)=>{
            if(err){
                let { id_usuario } = req.headers,
                    logoutUser = await Autenticacao.findOneAndUpdate({id_usuario},{$set: { logado: false}},{new:true})
                res.status(403).json({Error: "Token invalido"})
            } else {
                req.id_autenticacao = authData.autenticacao._id
                next()
            }
        })
    },
    async verificarSeUsuarioEstaLogado(req, res, next){
        let logado = false
        if(req.id_autenticacao){
            let autenticacao = await Autenticacao.findOne({_id: req.id_autenticacao})
            logado = autenticacao.logado
        }
        if(logado){
            next()
        } else { 
            res.status(403).json({Error: "Usuario não está logado"})
        }
    }
}