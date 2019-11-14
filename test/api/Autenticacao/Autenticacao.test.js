// process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const fs = require('fs')
const path = require('path')


const app = require('../../../src/app')
const conexaoComMongoDB = require('../../../src/conexaoComMongoDB')

before((done)=>{
    conexaoComMongoDB.open()
    dadosCompartilhados = objetoQueIniciaOsTestes = {
        novoRegistro: {
            email: "d90121@urhen.com",
            password: "12345",
            estabelecimento: {
                nome: "FestFestFesta",
                telefone: [
                    45745665
                ]
            },
            endereco: {
                rua: "Paulino",
                numero: 45,
                bairro: "Silvina",
                CEP: "09791310",
                estado: "sao paulo",
                uf: "SP",
                cidade: "sao bernardo",
                pais: "brasil"
            },
            usuarios: {
                nome: "Piris Piris da Silva",
                dt_nascimento: "02/12/85"
            }
        },
        registroCriado: null
    }
    done()
    })

after(async() => {
    await conexaoComMongoDB.close()
})

describe('Rotas de autenticação', ()=>{
    after(async ()=>{
        fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'), JSON.stringify(dadosCompartilhados, null, '\t'))
    })
    describe('Processo de registro',()=>{
        it('Criar novo registro com sucesso', (done)=>{
            request(app)
            .post('/auth/singin')
            .set('Content-Type','application/json')
            .send(objetoQueIniciaOsTestes.novoRegistro)
            .then((res)=>{
                dadosCompartilhados.registroCriado = res.body
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.contain.property('password').to.not.equal('12345')
                done()
            })
            .catch(err=>{done(err)})
        })
        it('Não criar novo registro por erro de mesmo estabelecimento',(done)=>{
            let estabelecimentoDuplicado = JSON.parse(JSON.stringify(dadosCompartilhados.novoRegistro))
            estabelecimentoDuplicado.email = 'email@diferente.com'
            
            request(app)
            .post('/auth/singin')
            .set('Content-type','application/json')
            .send(estabelecimentoDuplicado)
            .then((res)=>{
                expect(res.body).to.have.property('Error')
                expect(res.statusCode).to.equal(500)
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal(`Um estabelecimento com o nome ${estabelecimentoDuplicado.estabelecimento.nome} já existe`)
                done()
            })
            .catch(err=>done(err))
        })
        it('Não criar novo registro por erro de mesmo usuario',(done)=>{
            let estabelecimentoDuplicado = JSON.parse(JSON.stringify(dadosCompartilhados.novoRegistro))

            estabelecimentoDuplicado.estabelecimento.nome = 'FestFestParty'
            
            request(app)
            .post('/auth/singin')
            .set('Content-type','application/json')
            .send(estabelecimentoDuplicado)
            .then((res)=>{
                expect(res.body).to.have.property('Error')
                expect(res.statusCode).to.equal(500)
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal('Usuario ja existe')
                done()
            })
            .catch(err=>done(err))
        })
        it('O email do usuario criado confere com o enviado',(done)=>{
            expect(dadosCompartilhados.registroCriado.email).to.equal(dadosCompartilhados.novoRegistro.email)
            done()
        })
        it('O usuario deve iniciar invalidado',(done)=>{
            expect(dadosCompartilhados.registroCriado.validado).to.be.false
            done()
        })
        it('O usuario deve iniciar desbloqueado',(done)=>{
            expect(dadosCompartilhados.registroCriado.bloqueado).to.be.false
            done()
        })
        it('O usuario deve iniciar com acesso de administrador',(done)=>{
            expect(dadosCompartilhados.registroCriado.role).to.equal(1)
            done()
        })
    })
    describe('Processo de validacao de usuario',()=>{
        it('Usuario deve ser impedido de logar por não ter sido VALIDADO', (done)=>{
            request(app)
            .post('/auth/login')
            .query({'email': dadosCompartilhados.registroCriado.email})
            .set('password', 12345)
            .send()
            .then((res)=>{
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal('Ocorreu um erro, entre em contato com seu administrador')

                done()
            })
            .catch(err=>{
                done(err)
            })
        })
        it('Usuario deve ser validado com sucesso',(done)=>{
            let url = `/auth/validacaoDeUsuario/${dadosCompartilhados.registroCriado.email}/${dadosCompartilhados.registroCriado.emailToken}`
            request(app)
            .get(url)
            .then((res)=>{
                let body = res.body
                dadosCompartilhados.registroCriado.validado = body.validado
                expect(body.validado).to.be.true
                expect(res.statusCode).to.equal(200)
                done()
            })
            .catch(err=>done(err))
        })
        it('Usuario NÃO deve ser validado com email errado',(done)=>{
            let url = `/auth/validacaoDeUsuario/email@errado.com/${dadosCompartilhados.registroCriado.emailToken}`
            request(app)
            .get(url)
            .then((res)=>{
                expect(res.statusCode).to.equal(500)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal('Email não encontrado')
                done()
            })
            .catch(err=>done(err))
        })
        it('Token NÃO deve ser validado',(done)=>{
            let url = `/auth/validacaoDeUsuario/${dadosCompartilhados.novoRegistro.email}/TokenErrado`
            request(app)
            .get(url)
            .then((res)=>{
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal('Token invalido')
                done()
            })
            .catch(err=>done(err))
        })
        it('Usuario deve ter sido validado',(done)=>{
            expect(dadosCompartilhados.registroCriado.validado).to.be.true
            done()
        })
    })
    describe('Processo de login e logout',()=>{
        it('Usuario deve ser impedido de logar por USUARIO NÃO ENCONTRADO', (done)=>{
            request(app)
            .post('/auth/login')
            .query({'email': "email@errado.com"})
            .set('password', 12345)
            .send()
            .then((res)=>{
                expect(res.statusCode).to.equal(500)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.not.be.an('undefined')
                expect(res.body.Error).to.equal('Usuario não encontrado')

                done()
            })
            .catch(err=>{
                done(err)
            })
        })
        it('Usuario deve ser impedido de logar por SENHA INVALIDA', (done)=>{
            request(app)
            .post('/auth/login')
            .query({'email': dadosCompartilhados.registroCriado.email})
            .set('password', 123)
            .send()
            .then((res)=>{
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.equal('Password invalido')
                done()
            })
            .catch(err=>{
                done(err)
            })
        })
        it('Usuario deve ser LOGADO com sucesso', (done)=>{
            request(app)
            .post('/auth/login')
            .query({'email': dadosCompartilhados.registroCriado.email})
            .set('password', 12345)
            .send()
            .then((res)=>{
                dadosCompartilhados.registroCriado.tokenDeAutenticacao = `Baerer ${res.body.token}`
                expect(res.body).to.contain.property('token')
                expect(res.statusCode).to.equal(200)
                done()
            })
            .catch(err=>{
                done(err)
            })
        })
        it('Usuario deve ser impedido de logar por já estar LOGADO', (done)=>{
            request(app)
            .post('/auth/login')
            .query({'email': dadosCompartilhados.registroCriado.email})
            .set('password', 12345)
            .send()
            .then((res)=>{
                expect(res.statusCode).to.equal(403)
                expect(res.body).to.have.property('Error')
                expect(res.body.Error).to.equal('Ocorreu um erro, entre em contato com seu administrador')
                done()
            })
            .catch(err=>{done(err)})
        })
        it('Usuario deve ser DESLOGADO com sucesso',(done)=>{
            request(app)
            .post('/auth/logout')
            .set('id_usuario', dadosCompartilhados.registroCriado.id_usuario)
            .then((res)=>{
                expect(res.body.logado).to.be.false
                expect(res.statusCode).to.equal(200)
                done()
            })
            .catch(err=>done(err))
        })
    })
})
