const express = require('express')
const RotasConta = express.Router()
const { middlewareIsAdministrador, middlewareIsFuncionario } = require('../Services/Middlewares')

// Rotas de Conta
const ContaController = require('../Controllers/Conta/ContaController')
    //POST
    RotasConta.post('/novaConta', middlewareIsFuncionario, ContaController.store)
    // DELETE
    RotasConta.delete('/deletarConta', middlewareIsAdministrador, ContaController.destroy)
    // GET
    RotasConta.get('/buscarContas', ContaController.show)
    // PUT
    RotasConta.put('/editarConta/:id_conta_editar', middlewareIsFuncionario, ContaController.update)


module.exports = RotasConta

