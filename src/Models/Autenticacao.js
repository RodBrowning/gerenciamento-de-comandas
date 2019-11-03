const mongoose = require("mongoose")

const AutenticacaoSchema = new mongoose.Schema({
	id_usuario: String,
    email: String,
    password: String,
    validado: {type: Boolean, default: false},
    bloqueado: {type: Boolean, default: false},
    logado: {type: Boolean, default: false},
    role: {type: Number, default: 1}
})

module.exports = mongoose.model("Autenticacao", AutenticacaoSchema)