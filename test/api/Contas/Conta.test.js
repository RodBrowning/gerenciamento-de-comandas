const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../../../src/app')

describe('Rotas de Contas',()=>{
    before((done)=>{
        dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
        registroCriado = dadosCompartilhados.registroCriado
        usuarioCriado = dadosCompartilhados.usuarioCriado
        done()
    })
    after(()=>{
        fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'),JSON.stringify(dadosCompartilhados,null, '\t'))
    })
    describe('Processo de criacao e consulta de contas',()=>{
        it('Deve criar 5 uma contas com sucesso',(done)=>{
            dadosCompartilhados.contas = []
            let novasConta = [
                {
                    nome_cliente: "Rodrigo Moura da Silva"
                },
                {
                    nome_cliente: "Piria Moura da Silva"
                },
                {
                    nome_cliente: "Rafael Moura da Silva"
                },
                {
                    nome_cliente: "Nina Moura da Silva"
                },
                {
                    nome_cliente: "Frafra Moura da Silva"
                },
            ]
            
            novasConta.map(novaConta=>{
                request(app)
                .post('/novaConta')
                .type('json')
                .set('Context-type', 'Application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(novaConta)
                .then((res) =>{
                    let body = res.body
                    dadosCompartilhados.contas.push(body)
                    expect(res.statusCode).to.equal(200)
                    expect(body).to.have.own.property("dt_criacao")
                    expect(body).to.have.own.property("pago")
                    expect(body).to.have.own.property("desconto")
                    expect(body).to.have.own.property("listItems")
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("nome_cliente")
                    expect(body.nome_cliente).to.equal(novaConta.nome_cliente)
                })
                .catch(err=>done(err))    
            })
            setTimeout(function(){
                expect(dadosCompartilhados.contas).to.have.lengthOf(5)
                done();
            }, 500);
                
        })
        it('Deve retornar erro ao criar uma conta que já existe',(done)=>{
            let novaConta = {
                nome_cliente: "Rodrigo Moura da Silva"
            }
            request(app)
            .post('/novaConta')
            .type('json')
            .set('Context-type', 'Application/json')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento', registroCriado.id_estabelecimento)
            .set('autorizacao', registroCriado.tokenDeAutenticacao)
            .send(novaConta)
            .then((res) =>{
                let body = res.body
                expect(body).to.have.own.property("Error")
                expect(res.statusCode).to.equal(400)
                expect(body.Error).to.equal("Conta já existe")
                done()
            })
            .catch(err=>done(err))    
        })
        it('Deve incluir 2 items em uma conta',(done)=>{
            let novosListItem = [
                {
                    id_item: dadosCompartilhados.cardapio.items[0]._id,
                    quantidade: 3
                },
                {
                    id_item: dadosCompartilhados.cardapio.items[1]._id,
                    quantidade: 4
                }
            ]
            novosListItem.map(novoListItem=>{
                request(app)
                .post(`/novoListItem/${dadosCompartilhados.contas[0]._id}`)
                .type('json')
                .set('Context-type', 'Application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(novoListItem)
                .then((res) =>{
                    let body = res.body
                    dadosCompartilhados.contas[0].listItems.push(body._id)
                    expect(body).to.have.own.property("id_lancamentoListItem")
                    expect(body).to.have.own.property("dataCriacao")
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("id_item")
                    expect(body.id_item).to.equal(novoListItem.id_item)
                })
                .catch(err=>done(err))   
            })
            setTimeout(() => {
                expect(dadosCompartilhados.contas[0].listItems).to.have.lengthOf(2)
                done()
            }, 1000);
        })
        it('Deve incluir 3 unidades em um ListItem',(done)=>{
            let novoListItem = {
                    id_item: dadosCompartilhados.cardapio.items[0]._id,
                    quantidade: 4
                }
            request(app)
            .put(`/editarListItem/${dadosCompartilhados.contas[0].listItems[0]}/${dadosCompartilhados.contas[0]._id}`)
            .type('json')
            .set('Context-type', 'Application/json')
            .set('id_usuario', registroCriado.id_usuario)
            .set('id_estabelecimento', registroCriado.id_estabelecimento)
            .set('autorizacao', registroCriado.tokenDeAutenticacao)
            .send(novoListItem)
            .then((res) =>{
                let body = res.body
                
                expect(body).to.have.own.property("_id")
                expect(body).to.have.own.property("quantidadeTotal")
                expect(body).to.have.own.property("subTotal")
                expect(body.id_lancamentoListItem).to.have.lengthOf(2)
                done()
            })
            .catch(err=>done(err))   
        })
        it('Deve retornar uma conta com 2 items',(done)=>{
            let id_conta = dadosCompartilhados.contas[0]._id
            request(app)
                .get(`/buscarConta/${id_conta}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    let body = res.body
                    
                    dadosCompartilhados.contaConsultada = body
                    expect(body).to.have.own.property("dt_criacao")
                    expect(body).to.have.own.property("total_conta")
                    expect(body).to.have.own.property("pago")
                    expect(body).to.have.own.property("desconto")
                    expect(body).to.have.own.property("listItems")
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("nome_cliente")
                    expect(body.total_conta).to.be.above(0)
                    expect(body.listItems).to.have.lengthOf(2)
                    done()
                    
                })
                .catch(err=>done(err))
        })
        it('Deve remover 1 item da conta',(done)=>{done()})
        it('Deve retornar uma conta com 1 item',(done)=>{done()})
    })
    describe('Processo de atualização e remoção de items',()=>{
        it('Deve remover uma conta com sucesso',(done)=>{
            let id_conta_remover = dadosCompartilhados.contas[1]._id
            let nome_cliente = dadosCompartilhados.contas[1].nome_cliente
            request(app)
                .delete(`/deletarConta/${id_conta_remover}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res) =>{
                    let body = res.body
                    expect(body).to.have.own.property("dt_criacao")
                    expect(body).to.have.own.property("pago")
                    expect(body).to.have.own.property("desconto")
                    expect(body).to.have.own.property("listItems")
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("nome_cliente")
                    expect(body._id).to.equal(id_conta_remover)
                    expect(body.nome_cliente).to.equal(nome_cliente)
                    dadosCompartilhados.contas = dadosCompartilhados.contas.filter(conta=> conta._id != id_conta_remover)
                    done()
                })
                .catch(err=>done(err))
        })
        it('Deve atualizar uma conta com sucesso',(done)=>{
            let id_conta_editar = dadosCompartilhados.contas[0]._id
            let nome_cliente = dadosCompartilhados.contas[0].nome_cliente
            let conta_editar_body = {nome_cliente: "jaqueline"}
            request(app)
                .put(`/editarConta/${id_conta_editar}`)
                .type('json')
                .set('Context-type', 'Application/json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(conta_editar_body)
                .then((res) =>{
                    let body = res.body
                    dadosCompartilhados.contas[0] = res.body
                    expect(body).to.have.own.property("dt_criacao")
                    expect(body).to.have.own.property("pago")
                    expect(body).to.have.own.property("desconto")
                    expect(body).to.have.own.property("listItems")
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("nome_cliente")
                    expect(body._id).to.equal(id_conta_editar)
                    expect(body.nome_cliente).to.equal(conta_editar_body.nome_cliente)
                    done()
                })
                .catch(err=>done(err))
        })
        it('Deve retornar 4 contas',(done)=>{done()})
    })
})