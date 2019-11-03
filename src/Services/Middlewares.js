const { isAdministrador, isFuncionario, verificarEstabelecimentoNoModel, verificarContaNoEstabelecimento } = require('./VerificacoesDeSistema')
const Cardapio = require('../Models/Cardapio')
const Estabelecimento = require('../Models/Estabelecimento')


module.exports = {
    async middlewareIsAdministrador(req, res, next){
        let administrador = await isAdministrador(req.headers.id_estabelecimento, req.headers.id_usuario)
        if(administrador){
            next()
        } else {
            return res.json({Error:"Usuario não autorizado"})
        }
    },
    async middlewareIsFuncionario(req, res, next){
        let funcionario = await isFuncionario(req.headers.id_estabelecimento, req.headers.id_usuario)
        if(funcionario){
            next()
        } else {
            return res.json({Error:"Usuario não autorizado"})
        }
    },
    async middlewareIsDesteEstabelecimento(req, res, next){
        let {id_estabelecimento} = req.headers,
            id_model = req.params[Object.keys(req.params)[0]],
            pertenceAoEstabelecimento = await verificarEstabelecimentoNoModel(req.model, id_estabelecimento, id_model)

        if(pertenceAoEstabelecimento){
            next()
        } else {
            return res.json({Error: "Cardapio não pertence a este estabelecimento"})
        }
    },
    async middlewareContaDesteEstabelecimento(req, res, next){
        let {id_estabelecimento} = req.headers,
            id_cardapio = req.params[Object.keys(req.params)[0]],
            pertenceAoEstabelecimento = await verificarContaNoEstabelecimento(id_estabelecimento, id_cardapio)
            
        if(pertenceAoEstabelecimento){
            next()
        } else {
            return res.json({Error: "Conta não pertence a este estabelecimento"})
        }
    }
}