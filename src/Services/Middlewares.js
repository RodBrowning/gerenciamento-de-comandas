const { isAdministrador, isFuncionario, verificarEstabelecimentoNoModel, verificarContaNoEstabelecimento } = require('./VerificacoesDeSistema')
// const Cardapio = require('../Models/Cardapio')
// const Estabelecimento = require('../Models/Estabelecimento')


module.exports = {
    async isAdministradorMiddleware(req, res, next){
        let response = null,
            statusCode = 500,
            administrador = await isAdministrador(req.headers.id_estabelecimento, req.headers.id_usuario)
        if(administrador){
            next()
        } else {
            response = {Error: "Usuario não autorizado"}
            return res.status(statusCode).json(response)
        }
    },
    async isFuncionarioMiddleware(req, res, next){
        let funcionario = await isFuncionario(req.headers.id_estabelecimento, req.headers.id_usuario)
        if(funcionario){
            next()
        } else {
            return res.json({Error:"Usuario não autorizado"})
        }
    },
    async isDesteEstabelecimentoMiddleware(req, res, next){
        let {id_estabelecimento} = req.headers,
            id_model = req.params[Object.keys(req.params)[0]],
            pertenceAoEstabelecimento = await verificarEstabelecimentoNoModel(req.model, id_estabelecimento, id_model)

        if(pertenceAoEstabelecimento){
            next()
        } else {
            return res.json({Error: "O item não pertence a este estabelecimento"})
        }
    },
    async isContaDesteEstabelecimentoMiddleware(req, res, next){
        let {id_estabelecimento} = req.headers,
            id_conta = req.params[Object.keys(req.params)[0]],
            pertenceAoEstabelecimento = await verificarContaNoEstabelecimento(id_estabelecimento, id_conta)
            
        if(pertenceAoEstabelecimento){
            next()
        } else {
            return res.json({Error: "Conta não pertence a este estabelecimento"})
        }
    }
}