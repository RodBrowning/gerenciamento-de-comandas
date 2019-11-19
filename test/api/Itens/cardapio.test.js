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
        it('Deve incluir 5 items como ADMINISTRADOR com sucesso',(done)=>{
            
        })
        it('Deve retornar 5 items',(done)=>{
           
        })
        it('Deve retornar um item pesquisado como usuario NÃO administrador',(done)=>{
           
        })
        it('Deve retornar um ERRO ao incluir um item como usuario NÃO administrador',(done)=>{
           
        })
        it('Deve retornar um ERRO ao incluir um item que já existe',(done)=>{
           
        })
    })
    describe('Processo de atualização e remoção de cardápio',()=>{
        it('Deve ATUALIZAR um item com sucesso',(done)=>{
        
        })
        it('NÃO deve ATUALIZAR um item com um usuario NÃO administrador',(done)=>{
        
        })
        it('Deve REMOVER um item com sucesso',(done)=>{
           
        })
        it('NÃO deve REMOVER um item com um usuario NÃO administrador',(done)=>{
           
        })
        it('Deve retornar 4 items',(done)=>{
        
        })
    })
})