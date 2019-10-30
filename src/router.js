const express = require('express')
const routes = express.Router()


const RotasEstabelecimento = require("./Routes/RotasEstabelecimento")
const RotasUsuario = require("./Routes/RotasUsuario")
const RotasItem = require("./Routes/RotasItem")
const RotasCardapio = require("./Routes/RotasCardapio")
const RotasConta = require("./Routes/RotasConta")
const RotasListItem = require("./Routes/RotasListItem")

// Rotas da API
routes.use(RotasEstabelecimento)
routes.use(RotasUsuario)
routes.use(RotasItem)
routes.use(RotasCardapio)
routes.use(RotasConta)
routes.use(RotasListItem)

module.exports = routes