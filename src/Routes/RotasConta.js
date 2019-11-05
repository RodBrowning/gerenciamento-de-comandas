const express = require('express')
const RotasConta = express.Router()
const { isAdministradorMiddleware, isFuncionarioMiddleware, isContaDesteEstabelecimentoMiddleware } = require('../Services/Middlewares')


const bundledMiddlewaresAdministrador = [isAdministradorMiddleware, isContaDesteEstabelecimentoMiddleware]
const bundledMiddlewaresFuncionario = [isFuncionarioMiddleware, isContaDesteEstabelecimentoMiddleware]

// Rotas de Conta
const ContaController = require('../Controllers/Conta/ContaController')
    //POST
    RotasConta.post('/novaConta', isFuncionarioMiddleware, ContaController.store)
    // DELETE
    RotasConta.delete('/deletarConta/:id_conta_remover', bundledMiddlewaresAdministrador, ContaController.destroy)
    // GET
    RotasConta.get('/buscarContas', isFuncionarioMiddleware, ContaController.show)
    RotasConta.get('/buscarConta/:id_conta', bundledMiddlewaresFuncionario, ContaController.index)
    // PUT
    RotasConta.put('/editarConta/:id_conta_editar', bundledMiddlewaresFuncionario, ContaController.update)


module.exports = RotasConta

