const mongoose = require('mongoose')
const Autenticacao = require('./Autenticacao')

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    dt_nascimento: Date,
    telefones: { type: [Number], default: null },
    estabelecimentos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estabelecimento',
        required: true
    }],
    autenticacao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autenticacao'
    }
})

UsuarioSchema.post("findByIdAndDelete",async usuarioDeletado=>{
    let response = await Autenticacao.findOneAndDelete({_id: usuarioDeletado.autenticacao})
    return response
})

module.exports = mongoose.model("Usuario", UsuarioSchema)