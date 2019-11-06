const express = require('express')
const RotasAutenticacao = require('./Routes/RotasAutenticacao')
const routes = require('./router')
const app = express()

app.use(express.json())

app.use('/auth/',RotasAutenticacao)
app.use('/',routes)

module.exports = app