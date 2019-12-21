const Autenticacao = require('../../Models/Autenticacao')
const Estabelecimento = require('../../Models/Estabelecimento')
const Usuario = require('../../Models/Usuario')

module.exports = {
    async alterarNivelDeAcesso(req, res){
        let response = null,
            statusCode = 200,
            { role } = req.body,
            { id_usuario_alterar } = req.params,
            usuario_alterar = await Usuario.findOne({_id: id_usuario_alterar})

        response = await Autenticacao.findByIdAndUpdate({_id: usuario_alterar.autenticacao},{$set:{role}},{new:true})
        return res.status(statusCode).json(response)
    },
    async atualizarAssinatura(req, res){
        let response = null,
            statusCode = 200,
            dadosDaAssinatura = { 
              pacote, 
              pacoteAtivo,
              assinaturaAtiva,
              dt_ultimo_pagamento,
              numero_desativacoes,
              data_ultima_desativacao,
              dias_tolerancia_premium } = req.body,
            { id_usuario } = req.headers,
            usuario_alterar = await Usuario.findOne({_id: id_usuario}).populate('autenticacao')
        
        let estabelecimentos = await Estabelecimento.find({_id: usuario_alterar.estabelecimentos})

        let idsDeUsuarios = []
        estabelecimentos.map(estabelecimento=>{
            estabelecimento.usuarios.map(id_usuario =>{
                idsDeUsuarios.push(id_usuario)
            })
        })
        idsDeUsuarios = [...new Set(idsDeUsuarios)]
        
        let idsAutenticacao = []
        let usuarios = await Usuario.find({_id: idsDeUsuarios}).populate('autenticacao')
        usuarios.map(usuario =>{
            idsAutenticacao.push(usuario.autenticacao._id)
        })
        idsAutenticacao = [...new Set(idsAutenticacao)]
        await Autenticacao.updateMany({_id: idsAutenticacao}, dadosDaAssinatura)
        
        response = await Autenticacao.findById({_id: usuario_alterar.autenticacao._id})
        
        return res.status(statusCode).json(response)
    }
}