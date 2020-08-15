const { isAdministrador, isFuncionario, isGestor, verificarEstabelecimentoNoModel, verificarContaNoEstabelecimento, verificarItemNoEstabelecimento } = require('./VerificacoesDeSistema')
// const Cardapio = require('../Models/Cardapio')
// const Estabelecimento = require('../Models/Estabelecimento')


module.exports = {
    async isAdministradorMiddleware(req, res, next){
        
        let response = null,
            statusCode = 500,
            administrador = await isAdministrador(req.headers.id_estabelecimento, req.headers.id_usuario)
            .catch(err=>(false))
        if(administrador){
            next()
        } else {
            response = {Error: "Usuário não autorizado"}
            return res.status(statusCode).json(response)
        }
    },
    async isFuncionarioMiddleware(req, res, next){
        let response = null,
            statusCode = 500,
            funcionario = await isFuncionario(req.headers.id_estabelecimento, req.headers.id_usuario)
            .catch(err=>(false))

        if(funcionario){
            next()
        } else {
            response = {Error:"Usuário não autorizado"}
            return res.status(statusCode).json(response)
        }
    },
    async isGestorMiddleware(req, res, next){
        let response = null,
            statusCode = 500,
            gestor = await isGestor(req.headers.id_usuario)
            .catch(err=>(false))
            
        if(gestor){
            next()
        } else {
            response = {Error:"Usuário não autorizado"}
            return res.status(statusCode).json(response)
        }
    },
    async isDesteEstabelecimentoMiddleware(req, res, next){
        let {id_estabelecimento} = req.headers,
            id_model = req.params[Object.keys(req.params)[0]],
            pertenceAoEstabelecimento = await verificarEstabelecimentoNoModel(req.model, id_estabelecimento, id_model)
        
        if(pertenceAoEstabelecimento){
            next()
        } else {
            return res.status(500).json({Error: "O item não pertence a este estabelecimento"})
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
    },
    async isItemNoEstabelecimento(req, res, next){
        let id_item = req.params[Object.keys(req.params)[0]],
            {id_estabelecimento} = req.params,
            response = null,
            statusCode = null,
            itemEncontrado = false
        
        itemEncontrado = await verificarItemNoEstabelecimento(id_estabelecimento, id_item)
                        
        if(itemEncontrado){
            next()
        } else {
            response = { Error: "Item não encontrado no cardápio"}
            statusCode = 400
            res.status(statusCode).json(response)
        }
    }
}