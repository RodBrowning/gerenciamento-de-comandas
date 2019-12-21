const mongoose = require('mongoose')
const Usuario = require('./Usuario')

const LancamentoListItemSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    status: {type: String, enum: ["pendente","processando","pronto","entregue","cancelado"], default: "entregue"},
    observacao_do_cliente: {type: String, default: null},
    quantidade: Number,
    dataCriacao: {type: Date, default: new Date()}
})

LancamentoListItemSchema.post('findOneAndDelete',async lancamentoListItemRemovida => {
    if(lancamentoListItemRemovida){
        let idItemRemovido = lancamentoListItemRemovida._id,
            usuario = await Usuario.findOne({},{ids_lancamento_list_item: idItemRemovido})
        await Usuario.findOneAndUpdate({_id: usuario._id},{$pull: {ids_lancamento_list_item: idItemRemovido}})
    }
    return
})

module.exports = mongoose.model("LancamentoListItem", LancamentoListItemSchema)