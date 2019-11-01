const mongoose = require("mongoose")

const AutenticacaoSchema = new mongoose.Schema({
	id_usuario: String,
    email: String,
    password: String,
    validado: Boolean,
    bloqueado: Boolean,
    logado: Boolean,
    role: {type: Number, default: 1}
})

module.exports = mongoose.model("Autenticacao", AutenticacaoSchema)