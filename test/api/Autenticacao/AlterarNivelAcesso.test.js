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
                    expect(body).to.have.own.property('gestor')
                    expect(body.pacote).to.equal("premium")
                    expect(body.pacoteAtivo).to.equal("premium")
                    expect(body.assinaturaAtiva).to.be.true
                    expect(body.gestor).to.be.true
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
                    expect(body).to.have.own.property('gestor')
                    expect(body.pacote).to.equal("pro")
                    expect(body.pacoteAtivo).to.equal("pro")
                    expect(body.assinaturaAtiva).to.be.true
                    expect(body.gestor).to.be.true
                        registroCriado.dt_ultimo_pagamento = body.dt_ultimo_pagamento
                        registroCriado.pacote = body.pacote
                        registroCriado.pacoteAtivo = body.pacoteAtivo
                        registroCriado.assinaturaAtiva = body.assinaturaAtiva
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar erro ao assinar plano para usuario não for proprietário',(done)=>{
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
                })
                .catch(err=>done(err))
            })
            it('Deve rebaixar a assinatura pro para premium de usuarios que não pagaram mas não estão com mais de 30 dias de atraso',(done)=>{
                let dadosDaAssinatura = {
                    pacoteAtivo: 'premium',
                    assinaturaAtiva: false
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
                    expect(body).to.have.own.property('gestor')
                    expect(body.pacote).to.equal("pro")
                    expect(body.pacoteAtivo).to.equal("premium")
                    expect(body.assinaturaAtiva).to.be.false
                    expect(body.gestor).to.be.true
                        registroCriado.dt_ultimo_pagamento = body.dt_ultimo_pagamento
                        registroCriado.pacote = body.pacote
                        registroCriado.pacoteAtivo = body.pacoteAtivo
                        registroCriado.assinaturaAtiva = body.assinaturaAtiva
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve rebaixar a assinatura pro para free de usuarios que não pagaram e estão com mais de 30 dias de atraso',(done)=>{
                let dadosDaAssinatura = {
                    pacoteAtivo: 'free',
                    assinaturaAtiva: false
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
                    expect(body).to.have.own.property('gestor')
                    expect(body.pacote).to.equal("pro")
                    expect(body.pacoteAtivo).to.equal("free")
                    expect(body.assinaturaAtiva).to.be.false
                    expect(body.gestor).to.be.true
                        registroCriado.dt_ultimo_pagamento = body.dt_ultimo_pagamento
                        registroCriado.pacote = body.pacote
                        registroCriado.pacoteAtivo = body.pacoteAtivo
                        registroCriado.assinaturaAtiva = body.assinaturaAtiva
                    done()
                })
                .catch(err=>done(err))
            })
            // it('Deve retornar a lista de TODOS os usuarios',(done)=>{
            //     request(app)
            //     .get('/buscarUsuarios')
            //     .set('id_usuario', registroCriado.id_usuario)
            //     .set('id_estabelecimento',registroCriado.id_estabelecimento)
            //     .set('autorizacao',registroCriado.tokenDeAutenticacao)
            //     .then((res)=>{
            //         dadosCompartilhados.usuariosCriados = {...res.body}
            //         expect(res.statusCode).to.equal(200)
            //         expect(res.body).to.be.an('array')
            //         expect(res.body).to.have.lengthOf(3)
            //         done()
                    
            //     })
            //     .catch(err=>done(err))
            // })
        })
    })
}

/// usuarios que não pagaram mas dentro de 30 dias
/// usuarios que não pagaram mas mais de 30 dias