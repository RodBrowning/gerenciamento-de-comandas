const { isAdministrador, isFuncionario } = require('./VerificacoesDeSistema')


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
    }
}