const express = require('express')
const RotasAcompanhamento = express.Router()
const { isAdministradorMiddleware, isItemNoEstabelecimento } = require('../Services/Middlewares')

const bundledMiddlewares = [isAdministradorMiddleware, isItemNoEstabelecimento]
// Rotas de acompanhamento
const AcompanhamentoController = require('../Controllers/Item/AcompanhamentoController')
    //POSTS
    RotasAcompanhamento.post('/novoAcompanhamento', isAdministradorMiddleware, AcompanhamentoController.store)
    // DELETE
    RotasAcompanhamento.delete('/removerAcompanhamento/:id_Acompanhamento_remover/:id_estabelecimento', bundledMiddlewares, AcompanhamentoController.destroy)
    // UPDATE
    RotasAcompanhamento.put('/editarAcompanhamento/:id_Acompanhamento_editar/:id_estabelecimento', bundledMiddlewares, AcompanhamentoController.update)
    // GET
    RotasAcompanhamento.get('/buscarAcompanhamentos', AcompanhamentoController.show)
    RotasAcompanhamento.get('/buscarAcompanhamento/:id_Acompanhamento_buscar/:id_estabelecimento', isItemNoEstabelecimento, AcompanhamentoController.index)

module.exports = RotasAcompanhamento