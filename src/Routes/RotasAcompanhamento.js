const express = require('express')
const RotasAcompanhamento = express.Router()
const { isAdministradorMiddleware, isItemNoCardapio } = require('../Services/Middlewares')

const bundledMiddlewares = [isAdministradorMiddleware, isItemNoCardapio]
// Rotas de acompanhamento
const AcompanhamentoController = require('../Controllers/Item/AcompanhamentoController')
    //POSTS
    RotasAcompanhamento.post('/novoAcompanhamento', isAdministradorMiddleware, AcompanhamentoController.store)
    // DELETE
    RotasAcompanhamento.delete('/removerAcompanhamento/:id_Acompanhamento_remover/:id_cardapio', bundledMiddlewares, AcompanhamentoController.destroy)
    // UPDATE
    RotasAcompanhamento.put('/editarAcompanhamento/:id_Acompanhamento_editar/:id_cardapio', bundledMiddlewares, AcompanhamentoController.update)
    // GET
    RotasAcompanhamento.get('/buscarAcompanhamentos', AcompanhamentoController.show)
    RotasAcompanhamento.get('/buscarAcompanhamento/:id_Acompanhamento_buscar/:id_cardapio', isItemNoCardapio, AcompanhamentoController.index)

module.exports = RotasAcompanhamento