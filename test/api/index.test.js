const chai = require('chai')
const Autenticacao = require('./Autenticacao/Autenticacao.test')
const Usuario = require('./Usuario/Usuario.test')
const Bloqueio = require('./Autenticacao/Bloqueio.test')
const Items = require('./Items/Items.test')
const Acompanhamento = require('./Items/Acompanhamento.test')
const Cardapio = require('./Items/Cardapio.test')
const Conta = require('./Contas/Conta.test')
const AlterarNivelAcesso = require('./Autenticacao/AlterarNivelAcesso.test')
const Estabelecimento = require('./Estabelecimento/Estabelecimento.test')

const conexaoComMongoDB = require('../../src/conexaoComMongoDB')

before((done)=>{
    conexaoComMongoDB.open()
    dadosCompartilhados = objetoQueIniciaOsTestes = {
        novoRegistro: {
            email: "d90121@urhen.com",
            password: "12345",
            telefones: [1525635],
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
                dt_nascimento: "02/12/85",
                telefones: [66666666],
            }
        },
        registroCriado: null
    }
    done()
    })
    
after(async() => {
    await conexaoComMongoDB.close()
})   
Autenticacao()
Usuario()
Bloqueio()
Items()
Acompanhamento()
Cardapio()
Conta()
AlterarNivelAcesso()
Estabelecimento()