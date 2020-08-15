const mongoose = require("mongoose")
const Endereco = require('./Endereco')
const Usuario = require('./Usuario')
const Conta = require('./Conta')
const Cardapio = require('./Cardapio')
const Item = require('./Item')
const Acompanhamento = require('./Acompanhamento')
    

const EstabelecimentoSchema = new mongoose.Schema({
    nome: String,
    telefone: {type: [Number], default: []},
    fechado: {type: Boolean, default: false},
    endereco: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Endereco'
    },
    contas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conta',
        default: null
    }],
    usuarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    cardapios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cardapio',
        default: null
    }],
    id_cardapio_ativo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cardapio',
        default: null
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null
    }],
    acompanhamentos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acompanhamento',
        default: null
    }]
})

EstabelecimentoSchema.post('findOneAndDelete', async estabelecimentoRemovido => {
    let id_estabelecimentoRemovido = estabelecimentoRemovido._id,
        id_endereco = estabelecimentoRemovido.endereco,
        usuariosDoEstabelecimento = estabelecimentoRemovido.usuarios,
        contasDoEstabelecimento = estabelecimentoRemovido.contas,
        id_cardapios = estabelecimentoRemovido.cardapios
    
    await removerEndereco(id_endereco)

    usuariosDoEstabelecimento.map(async id_usuario => {
        await removerReferenciaNoModel(Usuario, id_usuario, id_estabelecimentoRemovido)  
    })

    contasDoEstabelecimento.map(async conta => {
        await removerContaRelacionadaAoEstabelecimento(conta._id)
    })
    id_cardapios.forEach(async id_cardapio => {
        return await removerReferenciaNoModel(Cardapio, id_cardapio, id_estabelecimentoRemovido)
    })
})

async function removerEndereco(id_endereco){
    let endereco = await Endereco.deleteOne({_id: id_endereco })
    return endereco
}
async function removerContaRelacionadaAoEstabelecimento(id_conta){
    let conta = await Conta.findOneAndDelete({_id: id_conta})
    return conta
}
async function removerReferenciaNoModel(Model, id_documento, id_estabelecimentoRemovido){
    let documento  = await Model.findOne({_id: id_documento}),
        estabelecimentosDoDocumento = documento.estabelecimentos

    if(estabelecimentosDoDocumento.length == 1){
        documento = await Model.findOneAndDelete({_id: id_documento})
    } else {
        let indexDoEstabelecimentoRemovido = estabelecimentosDoDocumento.indexOf(id_estabelecimentoRemovido)
        estabelecimentosDoDocumento.splice(indexDoEstabelecimentoRemovido,1)
        let novaListaDeEstabelecimentos = estabelecimentosDoDocumento
        documento = await Model.findByIdAndUpdate({_id: id_documento}, {$set: {estabelecimentos: novaListaDeEstabelecimentos}},{new:true})
    }
    return documento
}

module.exports = mongoose.model("Estabelecimento",EstabelecimentoSchema)