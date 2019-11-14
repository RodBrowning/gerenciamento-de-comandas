const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../../../src/app')

describe('Rotas de usuario',()=>{
    before((done)=>{
        dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
        registroCriado = dadosCompartilhados.registroCriado
        usuarioCriado = dadosCompartilhados.usuarioCriado

        //logar Usuario administrador
        request(app)
        .post('/auth/login')
        .query({'email': dadosCompartilhados.registroCriado.email})
        .set('password', 12345)
        .send()
        .then((res)=>{
            done()
        })
        .catch(err=>{
            done(err)
        })
    })
    after(()=>{
        fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'),JSON.stringify(dadosCompartilhados,null, '\t'))
    })
    describe('Processo de criacao de usuario',()=>{
        it('Deve criar um usuario com sucesso',(done)=>{
            let novoUsuario = {
                "nome": "Rodrigo", 
                "dt_nascimento": "02/12/85", 
                "estabelecimentos":
                [
                    `${registroCriado.id_estabelecimento}`
                ],
                "email": "rodrigo@teste.com",
                "password": "rodrigo",
                "role": 2
            }
            request(app)
            .post('/novoUsuario')
            .set('Content-Type','application/json')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento', registroCriado.id_estabelecimento)
            .set('autorizacao', registroCriado.tokenDeAutenticacao)
            .send(novoUsuario)
            .then((res)=>{        
                let { usuario, autenticacao } = res.body
                dadosCompartilhados.usuarioCriado = res.body
                expect(res.statusCode).to.equal(200)    
                expect(usuario).to.have.own.property('_id')
                expect(usuario).to.have.own.property('estabelecimentos')
                expect(usuario).to.have.own.property('autenticacao')
                expect(usuario.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                expect(usuario).to.have.own.property('nome')
                expect(usuario).to.have.own.property('dt_nascimento')
    
                expect(autenticacao.role).to.equal(2)
                expect(autenticacao).to.have.own.property('emailToken')
    
                expect(estabelecimento.usuarios).to.include(usuario._id)
    
                usuarioCriado = res.body
                done()
            })
            .catch(err=> done(err))
        })
        it('Usuario criado deve ser validado com sucesso',(done)=>{
            let {email, emailToken} = usuarioCriado.autenticacao
            let url = `/auth/validacaoDeUsuario/${email}/${emailToken}`
            request(app)
            .get(url)
            .then((res)=>{
                let body = res.body
                registroCriado.validado = body.validado
                expect(res.statusCode).to.equal(200)
                expect(body.validado).to.be.true
                done()
            })
            .catch(err=>done(err))
        })
        it('Usuario criado deve ser LOGADO com sucesso', (done)=>{
            let email = usuarioCriado.autenticacao.email
            request(app)
            .post('/auth/login')
            .query({'email': email})
            .set('password', 'rodrigo')
            .send()
            .then((res)=>{
                usuarioCriado.autenticacao.tokenDeAutenticacao = `Baerer ${res.body.token}`
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.contain.property('token')
                done()
            })
            .catch(err=>{
                done(err)
            })
        })
    })
    describe('Processo de listagem de usuarios',()=>{
        it('Deve retornar apenas dados do proprio usuario',(done)=>{
            let autenticacao = usuarioCriado.autenticacao
            let estabelecimento = usuarioCriado.estabelecimento
            request(app)
            .get(`/buscarUsuario/${autenticacao.id_usuario}`)
            .set('id_usuario', autenticacao.id_usuario)
            .set('id_estabelecimento', estabelecimento._id)
            .set('autorizacao', autenticacao.tokenDeAutenticacao)
            .then((res)=>{
                expect(res.statusCode).to.equal(200)
                expect(res.body.nome).to.equal(usuarioCriado.usuario.nome)
                expect(res.body._id).to.equal(autenticacao.id_usuario)
                done()
            })
            .catch(err=>done(err))
        })
        it('Deve retornar a lista de todos os usuarios',(done)=>{
            request(app)
            .get('/buscarUsuarios')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento',registroCriado.id_estabelecimento)
            .set('autorizacao',registroCriado.tokenDeAutenticacao)
            .then((res)=>{
                dadosCompartilhados.usuariosCriados = {...res.body}
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf(2)
                done()
                
            })
            .catch(err=>done(err))
        })
    })
    describe('Processo de alteracao de nivel de acesso',()=>{
        it('Deve alterar o nivel de acesso do usuario para administrador',(done)=>{
            request(app)
            .post(`/auth/alterarAcessoDoUsuario/${usuarioCriado.usuario._id}`)
            .set('Content-type','Application/json')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento', registroCriado.id_estabelecimento)
            .set('autorizacao', registroCriado.tokenDeAutenticacao)
            .send({"role":1})
            .then((res)=>{
                usuarioCriado.autenticacao.role = res.body.role
                expect(res.body).to.have.own.property("role")
                expect(res.body.role).to.equal(1)
                expect(res.statusCode).to.equal(200)
                done()
            })
            .catch(err=>done(err))
        })
        it('Deve alterar o nivel de acesso do usuario para funcionario',(done)=>{
            request(app)
            .post(`/auth/alterarAcessoDoUsuario/${usuarioCriado.usuario._id}`)
            .set('Content-type','Application/json')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento', registroCriado.id_estabelecimento)
            .set('autorizacao', registroCriado.tokenDeAutenticacao)
            .send({"role":2})
            .then((res)=>{
                usuarioCriado.autenticacao.role = res.body.role
                expect(res.body).to.have.own.property("role")
                expect(res.body.role).to.equal(2)
                expect(res.statusCode).to.equal(200)
                done()
            })
            .catch(err=>done(err))
        })
        it('Deve impedir que um usuario não administrador altere niveis de acesso',(done)=>{
            request(app)
            .post(`/auth/alterarAcessoDoUsuario/${registroCriado.id_usuario}`)
            .set('Content-type','Application/json')
            .set('id_usuario', usuarioCriado.usuario._id)
            .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
            .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
            .send({"role":2})
            .then((res)=>{
                expect(res.body).to.have.own.property("Error")
                expect(res.body.Error).to.equal("Usuario não autorizado")
                expect(res.statusCode).to.equal(500)
                done()
            })
            .catch(err=>done(err))
        })
    })
})
