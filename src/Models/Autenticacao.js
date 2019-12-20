const mongoose = require("mongoose")

const AutenticacaoSchema = new mongoose.Schema({
	id_usuario: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    email: String,
    password: String,
    pacote: {type: String, enum: ["free","premium","pro"], default: "free"},
    pacoteAtivo: {type: String, enum: ["free","premium","pro"], default: "free"},
    assinaturaAtiva: {type: Boolean, default: false},
    dt_ultimo_pagamento: {type: Date, default: null},
    numero_desativacoes: {type: Number, default: 0},
    dt_ultima_desativacao: {type: Date, default: null},
    dias_tolerancia_premium: {type: Number, default: 30},
    dono: {type: Boolean, default: false},
    validado: {type: Boolean, default: false},
    bloqueado: {type: Boolean, default: false},
    logado: {type: Boolean, default: false},
    role: {type: Number, default: 1},
    dt_criacao: {type: Date, default: new Date()}
    
})

module.exports = mongoose.model("Autenticacao", AutenticacaoSchema)