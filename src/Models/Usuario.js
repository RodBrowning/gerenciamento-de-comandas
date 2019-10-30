const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    dt_nascimento: Date,
    email: String,
    estabelecimentos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estabelecimento'
    }],
    role: Number
})

module.exports = mongoose.model("Usuario", UsuarioSchema)