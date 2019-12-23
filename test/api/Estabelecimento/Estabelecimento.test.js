module.exports = function Estabelecimento(){
    const chai = require('chai')
    const expect = chai.expect
    const request = require('supertest')
    const fs = require('fs')
    const path = require('path')

    const app = require('../../../src/app')

    describe('Rotas de Estabelecimento',()=>{
        before((done)=>{
            dadosCompartilhados = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json')))
            registroCriado = dadosCompartilhados.registroCriado
            usuarioCriado = dadosCompartilhados.usuarioCriado
            done()
        })
        after(()=>{
            fs.writeFileSync(path.resolve(__dirname,'..','dadosGeradosECompartilhadosEntreArquivosDeTeste.json'),JSON.stringify(dadosCompartilhados,null, '\t'))
        })
        describe('Processo de consulta de contas',()=>{
            
            it('Deve retornar todas os estabelecimentos do usuário',(done)=>{
                
                request(app)
                .get('/burcarEstabelecimentosDoUsuario')
                .set('id_usuario', usuarioCriado.usuario._id)
                .set('autorizacao', usuarioCriado.autenticacao.tokenDeAutenticacao)
                .then((res) =>{
                    console.log('res.body',res.body);
                    
                    done()
                })
                .catch(err=>done(err))    
            })
        })
    })
}