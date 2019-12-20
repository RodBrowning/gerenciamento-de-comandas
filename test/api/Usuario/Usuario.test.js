module.exports = function Usuario(){
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
            it('Deve criar dois usuario com sucesso',(done)=>{
                let novosUsuarios = [
                    {
                        "nome": "Rodrigo", 
                        "dt_nascimento": "02/12/85", 
                        "telefones": [1525635],
                        "estabelecimentos":
                        [
                            `${registroCriado.id_estabelecimento}`
                        ],
                        "email": "rodrigo@teste.com",
                        "password": "rodrigo",
                        "role": 2
                    },
                    {
                        "nome": "Amanda", 
                        "dt_nascimento": "12/09/98", 
                        "telefones": [123456],
                        "estabelecimentos":
                        [
                            `${registroCriado.id_estabelecimento}`
                        ],
                        "email": "amanda@teste.com",
                        "password": "amanda",
                        "role": 2
                    }
                ]
                let usuariosCriados = []
                let novosUsuariosPromises = []
                
                novosUsuarios.map(novoUsuario =>{
                    let promise =  new Promise((resolve, reject)=>{
                        request(app)
                        .post('/novoUsuario')
                        .set('Content-Type','application/json')
                        .set('id_usuario', registroCriado.id_usuario)
                        .set('id_estabelecimento', registroCriado.id_estabelecimento)
                        .set('autorizacao', registroCriado.tokenDeAutenticacao)
                        .send(novoUsuario)
                        .then((res)=>{        
                            let { usuario, autenticacao, estabelecimento } = res.body
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
                            usuariosCriados.push(res.body)
                            return resolve()
                        })
                        .catch(err=>reject(done(err)))
                    })
                    novosUsuariosPromises.push(promise)
                })
                
                Promise.all(novosUsuariosPromises).then(()=>{
                    dadosCompartilhados.usuarioCriado = usuariosCriados[0]
                    done()
                })
                .catch(err=>err)
            })
          
            it('Um usuario criado deve ser VALIDADO com sucesso',(done)=>{
                usuarioCriado = dadosCompartilhados.usuarioCriado
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
            it('Um usuario criado deve ser LOGADO com sucesso', (done)=>{
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
            it('Deve retornar apenas dados do PRÓPRIO usuario',(done)=>{
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
            it('Deve IMPEDIR que um usuario pesquise outro usuario',(done)=>{
                let autenticacao = usuarioCriado.autenticacao
                let estabelecimento = usuarioCriado.estabelecimento
                request(app)
                .get('/buscarUsuario/usuarioInexistente')
                .set('id_usuario', autenticacao.id_usuario)
                .set('id_estabelecimento', estabelecimento._id)
                .set('autorizacao', autenticacao.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve IMPEDIR um usuario que NÃO existe de faça consultas de usuario',(done)=>{
                let autenticacao = usuarioCriado.autenticacao
                let estabelecimento = usuarioCriado.estabelecimento
                request(app)
                .get(`/buscarUsuario/${autenticacao.id_usuario}`)
                .set('id_usuario', 'usuarioInexistente')
                .set('id_estabelecimento', estabelecimento._id)
                .set('autorizacao', autenticacao.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar a lista de TODOS os usuarios',(done)=>{
                request(app)
                .get('/buscarUsuarios')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento',registroCriado.id_estabelecimento)
                .set('autorizacao',registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    dadosCompartilhados.usuariosCriados = {...res.body}
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(3)
                    done()
                    
                })
                .catch(err=>done(err))
            })
            it('Deve IMPEDIR um usuario que NÃO existe de faça consultas de todos os usuarios',(done)=>{
                request(app)
                .get('/buscarUsuarios')
                .set('id_usuario', 'usuarioInexistente')
                .set('id_estabelecimento',registroCriado.id_estabelecimento)
                .set('autorizacao',registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
        })
        describe('Processo de alteracao de nivel de acesso',()=>{
            it('Deve alterar o nivel de acesso do usuario para ADMINISTRADOR',(done)=>{
                request(app)
                .put(`/auth/alterarAcessoDoUsuario/${usuarioCriado.usuario._id}`)
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
            it('Deve alterar o nivel de acesso do usuario para FUNCIONARIO',(done)=>{
                request(app)
                .put(`/auth/alterarAcessoDoUsuario/${usuarioCriado.usuario._id}`)
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
            it('Deve IMPEDIR que um usuario NÃO administrador altere niveis de acesso',(done)=>{
                request(app)
                .put(`/auth/alterarAcessoDoUsuario/${registroCriado.id_usuario}`)
                .set('Content-type','Application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send({"role":2})
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve IMPEDIR um usuario que NÃO existe de alterar niveis de acesso',(done)=>{
                request(app)
                .put('/auth/alterarAcessoDoUsuario/usuarioInexistente')
                .set('Content-type','Application/json')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send({"role":2})
                .then((res)=>{
                    expect(res.body).to.have.own.property("Error")
                    expect(res.body.Error).to.equal("Usuário não autorizado")
                    expect(res.statusCode).to.equal(500)
                    done()
                })
                .catch(err=>done(err))
            })
        })
        describe('Processo de atualizar e excluir funcionario',()=>{
            before((done)=>{
                // Criar usuario
                let novoUsuario = {
                    "nome": "samanta", 
                    "dt_nascimento": "95/04/25", 
                    "estabelecimentos":
                    [
                        `${registroCriado.id_estabelecimento}`
                    ],
                    "email": "samanta@teste.com",
                    "password": "samanta",
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
                    dadosCompartilhados.segundoUsuarioCriado = res.body
                    done()
                })
                .catch(err=> done(err))
            })
            it('Deve ATUALIZAR o usuario recém criado com sucesso',(done)=>{
                let atualizacoes = {
                    "nome": "Carla",
                    "email": "carla@test.com.br",
                    "password": "123"
                }
                request(app)
                .put(`/editarUsuario/${dadosCompartilhados.segundoUsuarioCriado.usuario._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(atualizacoes)
                .then((res)=>{
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.usuarioAtualizado).to.have.own.property('_id')
                    expect(res.body.usuarioAtualizado).to.have.own.property('nome')
                    expect(res.body.autenticacaoAtualizada).to.have.own.property('email')
                    expect(res.body.usuarioAtualizado._id).to.equal(dadosCompartilhados.segundoUsuarioCriado.usuario._id)
                    expect(res.body.usuarioAtualizado.nome).to.equal(atualizacoes.nome)
                    expect(res.body.autenticacaoAtualizada.email).to.equal(atualizacoes.email)
                    dadosCompartilhados.segundoUsuarioCriado = res.body
                    done()
                })
                .catch(err=>done(err))
            })
            it('Usuario NÃO deve ser atualizado por um usuario NÃO administrador',(done)=>{
                let atualizacoes = {
                    "nome": "Renata",
                    "email": "renata@test.com.br"
                }
                request(app)
                .put(`/editarUsuario/${dadosCompartilhados.segundoUsuarioCriado.usuarioAtualizado._id}`)
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('id_estabelecimento', usuarioCriado.estabelecimento._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .send(atualizacoes)
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Usuário não autorizado')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Usuario NÃO deve ser EXCLUIDO por um usuario não administrador',(done)=>{
                request(app)
                .delete(`/removerUsuario/${dadosCompartilhados.segundoUsuarioCriado.usuarioAtualizado._id}`)
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
            it('Deve retornar um ERRO ao ATUALIZAR um usuario que NÃO existe',(done)=>{
                let atualizacoes = {
                    "nome": "Carla",
                    "email": "carla@test.com.br",
                    "password": "123"
                }
                request(app)
                .put('/editarUsuario/id_inexistente')
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .send(atualizacoes)
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('O item não pertence a este estabelecimento')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve REMOVER um usuario com sucesso',(done)=>{
                request(app)
                .delete(`/removerUsuario/${dadosCompartilhados.segundoUsuarioCriado.usuarioAtualizado._id}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.have.own.property('_id')
                    expect(res.body).to.have.own.property('nome')
                    expect(res.body._id).to.equal(dadosCompartilhados.segundoUsuarioCriado.usuarioAtualizado._id)
                    expect(res.body.nome).to.equal(dadosCompartilhados.segundoUsuarioCriado.usuarioAtualizado.nome)
                    delete dadosCompartilhados.segundoUsuarioCriado
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar um ERRO ao se auto REMOVER',(done)=>{
                request(app)
                .delete(`/removerUsuario/${registroCriado.id_usuario}`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('Operação não autorizada')
                    done()
                })
                .catch(err=>done(err))
            })
            it('Deve retornar um ERRO ao REMOVER um usuario que NÃO existe',(done)=>{
                request(app)
                .delete(`/removerUsuario/usuarioInexistente`)
                .set('id_usuario', registroCriado.id_usuario)
                .set('id_estabelecimento', registroCriado.id_estabelecimento)
                .set('autorizacao', registroCriado.tokenDeAutenticacao)
                .then((res)=>{
                    expect(res.statusCode).to.equal(500)
                    expect(res.body).to.have.own.property('Error')
                    expect(res.body.Error).to.equal('O item não pertence a este estabelecimento')
                    done()
                })
                .catch(err=>done(err))
            })
        })
    })
}
