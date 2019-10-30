const express = require('express')
const RotasAutenticacao = express.Router()

// Rotas de Authenticação
    // GET
    RotasAutenticacao.get('/login',(req, res)=>{
        res.json("login")
    })
    // POST
    RotasAutenticacao.post('/singin',(req, res)=>{
        res.json("singin")
})

module.exports = RotasAutenticacao

