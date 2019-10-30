const express = require('express')
const RotasConta = express.Router()

// Rotas de Conta
const ContaController = require('../Controllers/Conta/ContaController')
    //POST
    RotasConta.post('/novaConta', ContaController.store)
    // DELETE
    RotasConta.delete('/deletarConta', ContaController.destroy)
    // GET
    RotasConta.get('/buscarContas', ContaController.show)
    // PUT
    RotasConta.put('/editarNomeConta/:id_conta_editar', ContaController.update)


module.exports = RotasConta

