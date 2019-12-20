module.exports = function AlterarNivelAcesso(){
    const chai = require('chai')
    const expect = chai.expect
    const request = require('supertest')
    const fs = require('fs')
    const path = require('path')

    const app = require('../../../src/app')

    describe('Rotas de alteração de níveis de acesso',()=>{
        before((done)=>{
            dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
            registroCriado = dadosCompartilhados.registroCriado
            usuarioCriado = dadosCompartilhados.usuarioCriado
            done()
        })
        after(()=>{
            fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'), JSON.stringify(dadosCompartilhados, null, '\t'))
        })
        
        describe('Processo de assinatura',()=>{
            it('Usuario deve assinar plano premium',(done)=>{
                let dadosDaAssinatura = {
                    dt_ultimo_pagamento: new Date,
                    pacote: 'premium', 
                    pacoteAtivo: 'premium',
                    assinaturaAtiva: true
                }
                request(app)
                .put('/auth/atualizarAssinatura')
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(dadosDaAssinatura)
                .then((res)=>{
                    let body = res.body
                    expect(body).to.have.own.property('dt_ultimo_pagamento')
                    expect(body).to.have.own.property('pacote')
                    expect(body).to.have.own.property('pacoteAtivo')
                    expect(body).to.have.own.property('assinaturaAtiva')
                    expect(body).to.have.own.property('dono')
                    expect(body.pacote).to.equal("premium")
                    expect(body.pacoteAtivo).to.equal("premium")
                    expect(body.assinaturaAtiva).to.be.true
                    expect(body.dono).to.be.true
                        registroCriado.dt_ultimo_pagamento = body.dt_ultimo_pagamento
                        registroCriado.pacote = body.pacote
                        registroCriado.pacoteAtivo = body.pacoteAtivo
                        registroCriado.assinaturaAtiva = body.assinaturaAtiva
                    done()
                })
                .catch(err=>done(err))
            })
            it('Usuario deve assinar plano pro',(done)=>{
                let dadosDaAssinatura = {
                    dt_ultimo_pagamento: new Date,
                    pacote: 'pro', 
                    pacoteAtivo: 'pro',
                    assinaturaAtiva: true
                }
                request(app)
                .put('/auth/atualizarAssinatura')
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(dadosDaAssinatura)
                .then((res)=>{
                    let body = res.body
                    expect(body).to.have.own.property('dt_ultimo_pagamento')
                    expect(body).to.have.own.property('pacote')
                    expect(body).to.have.own.property('pacoteAtivo')
                    expect(body).to.have.own.property('assinaturaAtiva')
                    expect(body).to.have.own.property('dono')
                    expect(body.pacote).to.equal("pro")
                    expect(body.pacoteAtivo).to.equal("pro")
                    expect(body.assinaturaAtiva).to.be.true
                    expect(body.dono).to.be.true
                        registroCriado.dt_ultimo_pagamento = body.dt_ultimo_pagamento
                        registroCriado.pacote = body.pacote
                        registroCriado.pacoteAtivo = body.pacoteAtivo
                        registroCriado.assinaturaAtiva = body.assinaturaAtiva
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar erro se usuario não for proprietário',(done)=>{
                let dadosDaAssinatura = {
                    pacote: 'premium', 
                    pacoteAtivo: 'premium',
                    assinaturaAtiva: true
                }
                request(app)
                .put('/auth/atualizarAssinatura')
                .set('Content-Type','application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send(dadosDaAssinatura)
                .then((res)=>{
                        expect(res.body).to.have.own.property("Error")
                        expect(res.body.Error).to.equal("Usuário não autorizado")
                        expect(res.statusCode).to.equal(500)
                        done()
                    }
                )
                .catch(err=>done(err))
            })
        })
    })
}