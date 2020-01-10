module.exports = function Cardapio(){
    const chai = require('chai')
    const expect = chai.expect
    const request = require('supertest')
    const fs = require('fs')
    const path = require('path')

    const app = require('../../../src/app')

    describe('Rotas de cardápio',()=>{
        before((done)=>{
            dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
            registroCriado = dadosCompartilhados.registroCriado
            usuarioCriado = dadosCompartilhados.usuarioCriado
            done()
        })
        after(()=>{
            fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'),JSON.stringify(dadosCompartilhados,null, '\t'))
        })
        describe('Processo de criacao e consulta de cardápio',()=>{
            it('Deve criar um cardapio como ADMINISTRADOR com sucesso',(done)=>{
                request(app)
                .post('/novoCardapio')
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de domingo",
                    listItems: [],
                    estabelecimentos: [registroCriado.id_estabelecimento]
                })
                .then((res)=>{
                    dadosCompartilhados.novoCardapio = res.body
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('nome_cardapio')
                    expect(res.body.nome_cardapio).to.equal('Cardapio de domingo')
                    expect(res.body).to.have.own.property('estabelecimentos')
                    expect(res.body.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                    expect(res.body).to.have.own.property('items')
                    expect(res.body.items).to.be.an('array')
                    expect(res.body.items).to.have.lengthOf(0)
                    expect(res.body.items).to.be.empty
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar 2 cardapios',(done)=>{
                request(app)
                .get('/buscarCardapios')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    dadosCompartilhados.cardapio = res.body[0]
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(2)
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar um ERRO ao incluir um cardápio como usuario NÃO administrador',(done)=>{
                request(app)
                .post('/novoCardapio')
                .set('Content-Type','application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de segunda",
                    listItems: [],
                    estabelecimentos: [usuarioCriado.estabelecimento._id]
                })
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Usuário não autorizado')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar um ERRO ao incluir um cardápio que já existe',(done)=>{
                request(app)
                .post('/novoCardapio')
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de domingo",
                    listItems: [],
                    estabelecimentos: [registroCriado.id_estabelecimento]
                })
                .then((res)=>{
                    expect(res.statusCode).to.equal(400)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('O cardápio já existe')
                    done()
                })
                .catch(err=>done(err))
            })
        })
        describe('Processo de atualização e remoção de cardápio',()=>{
            it('Deve ATUALIZAR um cardápio com sucesso',(done)=>{
                request(app)
                .put(`/editarCardapio/${dadosCompartilhados.novoCardapio._id}`)
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de sabado",
                    listItems: [],
                    acompanhamentos: [],
                    estabelecimentos: [registroCriado.id_estabelecimento]
                })
                .then((res)=>{
                    dadosCompartilhados.novoCardapio = res.body
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('nome_cardapio')
                    expect(res.body.nome_cardapio).to.equal('Cardapio de sabado')
                    expect(res.body).to.have.own.property('estabelecimentos')
                    expect(res.body.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                    expect(res.body).to.have.own.property('items')
                    expect(res.body.items).to.be.an('array')
                    expect(res.body.items).to.have.lengthOf(0)
                    expect(res.body.items).to.be.empty
                    done()
                })
                .catch(err=>done(err))
            })
            it('NÃO deve ATUALIZAR um cardápio com um usuario NÃO administrador',(done)=>{
                request(app)
                .put(`/editarCardapio/${dadosCompartilhados.novoCardapio._id}`)
                .set('Content-Type','application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de sexta",
                    listItems: [],
                    estabelecimentos: [usuarioCriado.estabelecimento._id]
                })
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Usuário não autorizado')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve REMOVER um cardápio com sucesso',(done)=>{
                request(app)
                .delete(`/removerCardapio/${dadosCompartilhados.novoCardapio._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('nome_cardapio')
                    expect(res.body.nome_cardapio).to.equal('Cardapio de sabado')
                    expect(res.body).to.have.own.property('estabelecimentos')
                    expect(res.body.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                    expect(res.body).to.have.own.property('items')
                    expect(res.body.items).to.be.an('array')
                    expect(res.body.items).to.have.lengthOf(0)
                    expect(res.body.items).to.be.empty
                    done()
                })
                .catch(err=>done(err))
            })
            it('NÃO deve REMOVER um cardápio com um usuario NÃO administrador',(done)=>{
                request(app)
                .delete(`/removerCardapio/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`)
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Usuário não autorizado')
                    done()
                })
                .catch(err=>done(err))
            })
            it('NÃO deve REMOVER um cardápio ativo',(done)=>{
                request(app)
                .delete(`/removerCardapio/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(400)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Não é possivel remover um cardapio ativo')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar 1 cardápio',(done)=>{
                request(app)
                .get('/buscarCardapios')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(1)
                    done()
                })
                .catch(err=>done(err))
            })
        })
    })
}