const express = require('express')
const RotasConta = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario, middlewareContaDesteEstabelecimento } = require('../Services/Middlewares')

// Rotas de Conta
const ContaController = require('../Controllers/Conta/ContaController')
    //POST
    RotasConta.post('/novaConta', middlewareIsFuncionario, ContaController.store)
    // DELETE
    RotasConta.delete('/deletarConta/:id_conta_remover', middlewareIsAdministrador, middlewareContaDesteEstabelecimento, ContaController.destroy)
    // GET
    RotasConta.get('/buscarContas', middlewareIsFuncionario, ContaController.show)
    RotasConta.get('/buscarConta/:id_conta', middlewareIsFuncionario, middlewareContaDesteEstabelecimento, ContaController.index)
    // PUT
    RotasConta.put('/editarConta/:id_conta_editar', middlewareIsFuncionario, middlewareContaDesteEstabelecimento, ContaController.update)


module.exports = RotasConta

