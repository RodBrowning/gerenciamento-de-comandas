const Estabelecimento = require('../Models/Estabelecimento')
const Cardapio = require('../Models/Cardapio')
const Usuario = require('../Models/Usuario')
// const Conta = require('../Models/Cardapio')
const ADMINISTRADOR = 1

module.exports = {
    async isAdministrador(id_estabelecimento, id_usuario){
        let temPermissaoDeAdministrador = false
        let usuariosDoEstabelecimento = await funcionariosDoEstabelecimento(id_estabelecimento)
        
        usuariosDoEstabelecimento.map(usuario_corrente => {                
            if(usuario_corrente._id.equals(id_usuario)
            && usuario_corrente.autenticacao.role === ADMINISTRADOR){
                temPermissaoDeAdministrador = true
            }
        })
        
        return temPermissaoDeAdministrador
    },
    async isFuncionario(id_estabelecimento, id_usuario){
        let funcionarioDoEstabelecimento = false
        let usuariosDoEstabelecimento = await funcionariosDoEstabelecimento(id_estabelecimento)

        usuariosDoEstabelecimento.map(usuario_corrente => {
            if(usuario_corrente._id.equals(id_usuario)){
                funcionarioDoEstabelecimento = true
            }
        })
        return funcionarioDoEstabelecimento
    },
    async isDono(id_usuario){
        let usuario = await Usuario.findById({_id: id_usuario}).populate("autenticacao")
        return usuario.autenticacao.dono
    },
    async verificarEstabelecimentoNoModel(Model, id_estabelecimento, id_model){
        let EstabelecimentoPertenceAoModel = false,
            model = null,
            encontrou = false
            
        model = await Model.findById({_id: id_model}).catch(err=>(false))
        if(model){
            encontrou = model.estabelecimentos.includes(id_estabelecimento) 
        }

        if(encontrou){
            EstabelecimentoPertenceAoModel = true
        }

        return EstabelecimentoPertenceAoModel
    },
    async verificarContaNoEstabelecimento(id_estabelecimento, id_conta){
        let ContaPertenceAoEstabelecimento = false,
            estabelecimento = null,
            contaEncontrada = false
        
        estabelecimento = await Estabelecimento.findById({_id: id_estabelecimento})
        if(estabelecimento){
            contaEncontrada = estabelecimento.contas.includes(id_conta)
        }
        
        if(contaEncontrada){
            ContaPertenceAoEstabelecimento = true
        }

        return ContaPertenceAoEstabelecimento
    },
    async verificarItemNoCardapio(id_cardapio, id_item){
        let itemEncontrado = false,
            cardapio = null

        cardapio = await Cardapio.findOne({_id:id_cardapio})
        
        cardapio.items.find(item=>{
            if(item._id.equals(id_item)){
                itemEncontrado = true
            }
        })
        return itemEncontrado
    }
}

async function  funcionariosDoEstabelecimento(id_estabelecimento){
    let estabelecimento = await Estabelecimento.findOne({_id: id_estabelecimento})
    .populate({
        path:"usuarios", 
        model: "Usuario", 
        populate: {
            path: "autenticacao",
            model: "Autenticacao"
    }})
    .populate("autenticacao")
    .catch(err=>(false))
    
    if(estabelecimento){
        return estabelecimento.usuarios
    }
    return null
}
