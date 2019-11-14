const express = require('express')
const app = express()
const RotasAutenticacao = require('./Routes/RotasAutenticacao')
const RotasDeBloqueioDeUsuario = require('./Routes/RotasDeBloqueioDeUsuario')
const RotasDeNivelDeAcesso = require('./Routes/RotasDeNivelDeAcesso')
const routes = require('./router')
const { verificarExistenciaDeToken, 
        verificarValidadeDoTokenFornecido, 
        verificarSeUsuarioEstaLogado } = require('./Services/MiddlewaresDeAutenticacao')

app.use(express.json())

// JWT middlewares
const bundledMiddlewares = [verificarExistenciaDeToken, verificarValidadeDoTokenFornecido,verificarSeUsuarioEstaLogado]

app.use('/auth/',RotasAutenticacao)
app.use('/auth/', bundledMiddlewares,RotasDeBloqueioDeUsuario)
app.use('/auth/', bundledMiddlewares,RotasDeNivelDeAcesso)
app.use('/',bundledMiddlewares, routes)

module.exports = app