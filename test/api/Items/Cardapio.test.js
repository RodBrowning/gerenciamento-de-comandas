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
            it('Deve criar 2 cardapios como ADMINISTRADOR com sucesso',(done)=>{
                let cardapios = [
                    {
                        nome_cardapio: "Cardapio de domingo",
                        listItems: [],
                        estabelecimentos: [registroCriado.id_estabelecimento]
                    },
                    {
                        nome_cardapio: "Cardapio da semana",
                        listItems: [],
                        estabelecimentos: [registroCriado.id_estabelecimento]
                    }
                ]
                let novosItemsPromises = []

                cardapios.map(cardapio=>{
                    let promise =  new Promise((resolve, reject)=>{
                        request(app)
                        .post('/novoCardapio')
                        .set('Content-Type','application/json')
                        .set('id_usuario', registroCriado.id_usuario)
                        .set('id_estabelecimento', registroCriado.id_estabelecimento)
                        .set('autorizacao', registroCriado.tokenDeAutenticacao)
                        .send(cardapio)
                        .then((res)=>{
                            // dadosCompartilhados.novoCardapio = res.body
                            expect(res.statusCode).to.equal(200)
                            expect(res.body).to.have.own.property('nome_cardapio')
                            expect(res.body.nome_cardapio).to.equal(cardapio.nome_cardapio)
                            expect(res.body).to.have.own.property('dias')
                            expect(res.body.dias).to.be.an('array')
                            expect(res.body.dias).to.have.lengthOf(1)
                            expect(res.body.dias[0]).to.equal('all')
                            expect(res.body).to.have.own.property('estabelecimentos')
                            expect(res.body.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                            expect(res.body).to.have.own.property('items')
                            expect(res.body.items).to.be.an('array')
                            expect(res.body.items).to.have.lengthOf(0)
                            expect(res.body.items).to.be.empty
                            return resolve()
                        })
                        .catch(err=>done(err))                        
                    })
                    novosItemsPromises.push(promise)
                })
                Promise.all(novosItemsPromises)
                .then(()=>{
                    done();
                })
            })
            it('Deve retornar 2 cardapios',(done)=>{
                request(app)
                .get('/buscarCardapios')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    
                    dadosCompartilhados.cardapios = res.body
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
                .put(`/editarCardapio/${dadosCompartilhados.cardapios[0]._id}`)
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de sabado",
                    items: [dadosCompartilhados.items[0]._id, dadosCompartilhados.items[1]._id],
                    acompanhamentos: [],
                    estabelecimentos: [registroCriado.id_estabelecimento]
                })
                .then((res)=>{
                    dadosCompartilhados.cardapios[0] = res.body
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('nome_cardapio')
                    expect(res.body.nome_cardapio).to.equal('Cardapio de sabado')
                    expect(res.body).to.have.own.property('dias')
                    expect(res.body.dias).to.be.an('array')
                    expect(res.body.dias).to.have.lengthOf(1)
                    expect(res.body.dias[0]).to.equal('all')
                    expect(res.body).to.have.own.property('estabelecimentos')
                    expect(res.body.estabelecimentos).to.have.members([registroCriado.id_estabelecimento])
                    expect(res.body).to.have.own.property('items')
                    expect(res.body.items).to.be.an('array')
                    expect(res.body.items).to.have.lengthOf(2)
                    done()
                })
                .catch(err=>done(err))
            })
            it('NÃO deve ATUALIZAR um cardápio com um usuario NÃO administrador',(done)=>{
                request(app)
                .put(`/editarCardapio/${dadosCompartilhados.cardapios[0]._id}`)
                .set('Content-Type','application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send({ 
                    nome_cardapio: "Cardapio de sexta",
                    items: [],
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
                .delete(`/removerCardapio/${dadosCompartilhados.cardapios[1]._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('nome_cardapio')
                    expect(res.body.nome_cardapio).to.equal(dadosCompartilhados.cardapios[1].nome_cardapio)
                    expect(res.body).to.have.own.property('dias')
                    expect(res.body.dias).to.be.an('array')
                    expect(res.body.dias).to.have.lengthOf(1)
                    expect(res.body.dias[0]).to.equal('all')
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
            it('Deve ATIVAR um cardápio com sucesso',(done)=>{
                request(app)
                .put(`/editarEstabelecimento`)
                .set('Content-Type','application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send({ 
                    id_cardapio_ativo: dadosCompartilhados.cardapios[0]._id
                })
                .then((res)=>{
                    
                    usuarioCriado.estabelecimento.id_cardapio_ativo = res.body.id_cardapio_ativo
                    usuarioCriado.estabelecimento.cardapios = res.body.cardapios
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('id_cardapio_ativo')
                    expect(res.body.id_cardapio_ativo).to.equal(dadosCompartilhados.cardapios[0]._id)
                    done()
                })
                .catch(err=>done(err))
            })
            it('NÃO deve REMOVER um cardápio ativo',(done)=>{
                request(app)
                .delete(`/removerCardapio/${usuarioCriado.estabelecimento.id_cardapio_ativo}`)
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
                    dadosCompartilhados.cardapio = res.body[0]

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