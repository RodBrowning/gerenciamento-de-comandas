module.exports = function Bloqueio(){
    const chai = require('chai')
    const expect = chai.expect
    const request = require('supertest')
    const fs = require('fs')
    const path = require('path')

    const app = require('../../../src/app')

    describe('Rotas de bloqueio de usuario',()=>{
        before((done)=>{
            dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
            registroCriado = dadosCompartilhados.registroCriado
            usuarioCriado = dadosCompartilhados.usuarioCriado
            done()
        })
        after(()=>{
            fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'), JSON.stringify(dadosCompartilhados, null, '\t'))
        })
        
        describe('Processo de bloqueio',()=>{
            it('Usuario deve ser BLOQUEADO',(done)=>{
                request(app)
                .post(`/auth/bloquearusuario/${usuarioCriado.usuario._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                        usuarioCriado.autenticacao.bloqueado = res.body.bloqueado
                        expect(res.body).to.have.property('bloqueado')
                        expect(res.body.bloqueado).to.be.true
                        expect(res.statusCode).to.equal(200)
                        done()
                    }
                )
                .catch(err=>done(err))
            })
            it('Usuario deve ser IMPEDIDO de logar por estar BLOQUEADO', (done)=>{
                request(app)
                .post('/auth/login')
                .query({'email':  registroCriado.email})
                .set('password', 12345)
                .send()
                .then((res)=>{
                    expect(res.body).to.have.property('Error')
                    expect(res.statusCode).to.equal(403)
                    expect(res.body.Error).to.not.be.an('undefined')
                    expect(res.body.Error).to.equal('Ocorreu um erro, entre em contato com seu administrador')
                    done()
                })
                .catch(err=>{
                    done(err)
                })
            })
            it('Usuario deve ser DESBLOQUEADO',(done)=>{
                request(app)
                .post(`/auth/desbloquearUsuario/${usuarioCriado.usuario._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    usuarioCriado.autenticacao.bloqueado = res.body.bloqueado
                    expect(res.body).to.have.property('bloqueado')
                    expect(res.body.bloqueado).to.be.false
                    expect(res.statusCode).to.equal(200)
                    done()
                })
                .catch(err=>done(err))
            })
            it('Usuario deve LOGAR normalmente após ser DESBLOQUEADO', (done)=>{
                request(app)
                .post('/auth/login')
                .query({'email':  usuarioCriado.autenticacao.email})
                .set('password', 'rodrigo')
                .send()
                .then((res)=>{
                    usuarioCriado.autenticacao.logado = res.body.autenticacao.logado
                    expect(res.body.autenticacao).to.have.property('logado')
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.autenticacao.logado).to.be.true
                    done()
                })
                .catch(err=>{
                    done(err)
                })
            })
            it('Deve impedir que um usuario NÃO administrador faça bloqueio de usuarios',(done)=>{
                request(app)
                .post(`/auth/bloquearusuario/${registroCriado.id_usuario}`)
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .then((res)=>{
                        expect(res.statusCode).to.equal(500)
                        expect(res.body).to.have.property('Error')
                        expect(res.body.Error).to.equal('Usuário não autorizado')
                        done()
                    }
                )
                .catch(err=>done(err))
            })
            it('Deve retornar ERRO caso o estabelecimento NÃO exista',(done)=>{
                request(app)
                .post(`/auth/bloquearusuario/${usuarioCriado.usuario._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', 'estabelecimentoInexistente')
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
        })
    })
}