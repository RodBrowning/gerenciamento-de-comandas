const Estabelecimento = require('../Models/Estabelecimento')
const ADMINISTRADOR = 1

module.exports = {
    async isAdministrador(id_estabelecimento, id_usuario){
        let temPermissaoDeAdministrador = false
        let usuariosDoEstabelecimento = await funcionariosDoEstabelecimento(id_estabelecimento)
        
        if(usuariosDoEstabelecimento){
            usuariosDoEstabelecimento.map(usuario_corrente => {
                if(usuario_corrente._id.equals(id_usuario)
                && usuario_corrente.role === ADMINISTRADOR){
                    temPermissaoDeAdministrador = true
                }
            })
        }
        
        return temPermissaoDeAdministrador
    },
    async isFuncionario(id_estabelecimento, id_usuario){
        let funcionarioDoEstabelecimento = false
        let usuariosDoEstabelecimento = await funcionariosDoEstabelecimento(id_estabelecimento)

        if(usuariosDoEstabelecimento){
            usuariosDoEstabelecimento.map(usuario_corrente => {
                if(usuario_corrente._id.equals(id_usuario)){
                    funcionarioDoEstabelecimento = true
                }
            })
        }
        return funcionarioDoEstabelecimento
    }
}

async function  funcionariosDoEstabelecimento(id_estabelecimento){
    let estabelecimento = await Estabelecimento.findOne({_id: id_estabelecimento}).populate("usuarios")
    
    if(estabelecimento){
        return estabelecimento.usuarios
    }
    return null
}