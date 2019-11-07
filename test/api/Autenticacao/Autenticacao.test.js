process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../../../src/app')
const conexaoComMongoDB = require('../../../src/conexaoComMongoDB')

before((done)=>{
    conexaoComMongoDB.open()
    novoEstabelecimento = {
        "email": "d90121@urhen.com",
        "password": "12345",
        "estabelecimento": {
            "nome": "Teste", 
            "telefone": [45745665]
        },
        "endereco": {
            "rua":"Paulino", 
            "numero": 45, 
            "bairro": "Silvina", 
            "CEP": "09791310", 
            "estado": "sao paulo", 
            "uf": "SP", 
            "cidade": "sao bernardo", 
            "pais": "brasil"
        }, 
        "usuarios": 
        {
            "nome": "Tete", 
            "dt_nascimento": "02/12/85"
        }
    }
    emailToken = null
    done()
    })

after(async() => {
    await conexaoComMongoDB.close()
})

describe('Rotas de autenticação', ()=>{

    describe('Route - /auth/singin',()=>{

        it('Criando novo estabelecimento', (done)=>{
            request(app).post('/auth/singin')
            .set("Content-Type","application/json")
            .send(novoEstabelecimento)
            .then((res)=>{
                let body = res.body
                emailToken = res.body.token
                
                expect(body.autenticacao).to.contain.property('password').to.not.equal('12345')
                done()
            })
            .catch(err=>{done(err)})
        })

    })

    describe('Route - /validacaoDeUsuario/',()=>{
        it('Validar usuario',(done)=>{
            let url = `/auth/validacaoDeUsuario/${novoEstabelecimento.email}/${emailToken}`
            request(app)
            .get(url)
            .then((res)=>{
                let body = res.body
                expect(body.validado).to.be.true
                done()
            })
            .catch(err=>{done(err)})
        })
    })

    describe('Route - /auth/login',()=>{
        
        it('Efetuar login', (done)=>{
            request(app)
            .post('/auth/login')
            .query({"email": novoEstabelecimento.email})
            .set('password', 12345)
            .send()
            .then((res)=>{
                let body = res.body
                expect(body).to.contain.property('token')
                done()
            })
            .catch(err=>{
                done(err)
            })
        })
    })
})
