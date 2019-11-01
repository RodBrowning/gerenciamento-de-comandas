const Autenticacao = require('../Models/Autenticacao')
const jwt = require('jsonwebtoken')

module.exports = {
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
        jwt.verify(req.token, "teste", function(err, authData){
            if(err){
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