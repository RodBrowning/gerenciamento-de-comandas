module.exports = function Conta(){
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
                let novasContas = [
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
                let novasContasPromises = []

                novasContas.map(novaConta=>{
                    let promise =  new Promise((resolve, reject)=>{
                        request(app)
                        .post('/novaConta')
                        .type('json')
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
                            return resolve()
                        })
                        .catch(err=>reject(done(err)))
                    })
                    novasContasPromises.push(promise)
                })

                Promise.all(novasContasPromises).then(()=>{
                    expect(dadosCompartilhados.contas).to.have.lengthOf(5)
                    done()
                })
                    
            })
            it('Deve retornar erro ao criar uma conta que já existe',(done)=>{
                let novaConta = {
                    nome_cliente: "Rodrigo Moura da Silva"
                }
                request(app)
                .post('/novaConta')
                .type('json')
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
            it('Deve incluir 2 ListItem em 2 contas',(done)=>{
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
                let contas = [dadosCompartilhados.contas[0], dadosCompartilhados.contas[1]]
                let novosListItemPromises = []
                contas.map((conta)=>{
                    novosListItem.map(novoListItem=>{
                        let promise =  new Promise((resolve, reject)=>{
                            request(app)
                            .post(`/novoListItem/${conta._id}`)
                            .type('json')
                            .set('Context-type', 'Application/json')
                            .set('id_usuario', registroCriado.id_usuario)
                            .set('id_estabelecimento', registroCriado.id_estabelecimento)
                            .set('autorizacao', registroCriado.tokenDeAutenticacao)
                            .send(novoListItem)
                            .then((res) =>{
                                let body = res.body
                                conta.listItems.push(body._id)
                                expect(body).to.have.own.property("ids_lancamentoListItem")
                                expect(body).to.have.own.property("dataCriacao")
                                expect(body).to.have.own.property("_id")
                                expect(body).to.have.own.property("id_item")
                                expect(body.id_item).to.equal(novoListItem.id_item)
                                return resolve()
                            })
                            .catch(err=>reject(done(err)))
                        })
                        novosListItemPromises.push(promise)
                    })
                })
                
                Promise.all(novosListItemPromises).then(()=>{
                    expect(dadosCompartilhados.contas[0].listItems).to.have.lengthOf(2)
                    done()
                })
            })
            it('Deve incluir 6 unidades em um ListItem',(done)=>{
                let novoListItem = {
                        id_item: dadosCompartilhados.cardapio.items[0]._id,
                        quantidade: 6
                    }
                request(app)
                .put(`/editarListItem/${dadosCompartilhados.contas[1].listItems[0]}/${dadosCompartilhados.contas[1]._id}`)
                .type('json')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(novoListItem)
                .then((res) =>{
                    let body = res.body
                    
                    expect(body).to.have.own.property("_id")
                    expect(body).to.have.own.property("quantidadeTotal")
                    expect(body).to.have.own.property("subTotal")
                    expect(body.ids_lancamentoListItem).to.have.lengthOf(2)
                    done()
                })
                .catch(err=>done(err))   
            })
            it('Deve retornar uma conta com 2 ListItem',(done)=>{
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
            it('Deve remover 1 listIitem de uma conta',(done)=>{
                let id_listitem_remover = dadosCompartilhados.contas[0].listItems[0]
                request(app)
                    .delete(`/removerListItem/${id_listitem_remover}`)
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .then((res)=>{
                        let body = res.body
                        // console.log("res.body",res.body);
                        
                        done()
                    })
                    .catch(err=>done(err))
            })
            it('Deve retornar uma conta com 1 ListItem',(done)=>{
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
                        expect(body.listItems).to.have.lengthOf(1)
                        done()
                        
                    })
                    .catch(err=>done(err))
            })
            it('Deve retornar 5 contas',(done)=>{
                request(app)
                    .get('/buscarContas/')
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .then((res)=>{
                        let body = res.body  
                        dadosCompartilhados.contas = body
                        expect(body).to.have.lengthOf(5)
                        done()
                        
                    })
                    .catch(err=>done(err))
            })
        })
        describe('Processo de atualização e remoção de items',()=>{
            it('Deve remover uma conta com sucesso',(done)=>{
                let id_conta_remover = dadosCompartilhados.contas[2]._id
                let nome_cliente = dadosCompartilhados.contas[2].nome_cliente
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
            it('Deve atualizar uma conta para pago sem desconto',(done)=>{
                let id_conta_editar = dadosCompartilhados.contas[0]._id
                let dadosDePagamento = {
                    dt_pagamento: Date(),
                    valor_pago: dadosCompartilhados.contas[0].total_conta,
                }
                request(app)
                    .put(`/editarConta/${id_conta_editar}`)
                    .type('json')
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .send(dadosDePagamento)
                    .then((res)=>{
                        let body = res.body
                      
                        expect(body).to.have.own.property("dt_criacao")
                        expect(body).to.have.own.property("dt_pagamento")
                        expect(body).to.have.own.property("total_conta")
                        expect(body).to.have.own.property("valor_pago")
                        expect(body).to.have.own.property("pago")
                        expect(body).to.have.own.property("desconto")
                        expect(body).to.have.own.property("listItems")
                        expect(body).to.have.own.property("_id")
                        expect(body).to.have.own.property("nome_cliente")
                        expect(Date.parse(body.dt_pagamento)).to.equal(Date.parse(dadosDePagamento.dt_pagamento))
                        expect(body.valor_pago).to.equal(dadosDePagamento.valor_pago)
                        expect(body.pago).to.be.true
                        expect(body.desconto).to.be.false
                        done()
                    })
                    .catch(err=>done(err))
            })
            it('Deve atualizar uma conta para pago com desconto',(done)=>{
                let id_conta_editar = dadosCompartilhados.contas[1]._id
                let dadosDePagamento = {
                    dt_pagamento: Date(),
                    valor_pago: dadosCompartilhados.contas[1].total_conta - 10,
                    desconto: true
                }
                request(app)
                    .put(`/editarConta/${id_conta_editar}`)
                    .type('json')
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .send(dadosDePagamento)
                    .then((res)=>{
                        let body = res.body
                        
                        expect(body).to.have.own.property("dt_criacao")
                        expect(body).to.have.own.property("dt_pagamento")
                        expect(body).to.have.own.property("total_conta")
                        expect(body).to.have.own.property("valor_pago")
                        expect(body).to.have.own.property("pago")
                        expect(body).to.have.own.property("desconto")
                        expect(body).to.have.own.property("listItems")
                        expect(body).to.have.own.property("_id")
                        expect(body).to.have.own.property("nome_cliente")
                        expect(Date.parse(body.dt_pagamento)).to.equal(Date.parse(dadosDePagamento.dt_pagamento))
                        expect(body.valor_pago).to.equal(dadosDePagamento.valor_pago)
                        expect(body.pago).to.be.true
                        expect(body.desconto).to.be.true
                        done()
                    })
                    .catch(err=>done(err))
            })
            it('Deve retornar erro ao atualizar uma conta já paga',(done)=>{
                let id_conta_editar = dadosCompartilhados.contas[0]._id
                let dadosDePagamento = {
                    dt_pagamento: Date(),
                    valor_pago: 3,
                    pago: false
                }
                request(app)
                    .put(`/editarConta/${id_conta_editar}`)
                    .type('json')
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .send(dadosDePagamento)
                    .then((res)=>{
                        let body = res.body
                        expect(res.statusCode).to.equal(400)
                        expect(res.body).to.have.own.property('Error')
                        expect(res.body.Error).to.equal('Está conta já foi fechada')
                        done()
                    })
                    .catch(err=>done(err))
            })
            it('Deve retornar 4 contas',(done)=>{
                request(app)
                    .get('/buscarContas/')
                    .set('id_usuario', registroCriado.id_usuario)
                    .set('id_estabelecimento', registroCriado.id_estabelecimento)
                    .set('autorizacao', registroCriado.tokenDeAutenticacao)
                    .then((res)=>{
                        let body = res.body
                        dadosCompartilhados.contas = body
                        expect(body).to.have.lengthOf(4)
                        done()
                        
                    })
                    .catch(err=>done(err))
            })
        })
    })
}