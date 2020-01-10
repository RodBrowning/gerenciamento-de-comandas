module.exports = function Acompanhamento() {
  const chai = require("chai");
  const expect = chai.expect;
  const request = require("supertest");
  const fs = require("fs");
  const path = require("path");

  const app = require("../../../src/app");

  describe("Rotas de acompanhamento", () => {
    before(done => {
      dadosCompartilhados = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            "..",
            "dadosGeradosECompartilhadosEntreArquivosDeTeste.json"
          )
        )
      );
      registroCriado = dadosCompartilhados.registroCriado;
      usuarioCriado = dadosCompartilhados.usuarioCriado;
      done();
    });
    after(() => {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          "..",
          "dadosGeradosECompartilhadosEntreArquivosDeTeste.json"
        ),
        JSON.stringify(dadosCompartilhados, null, "\t")
      );
    });
    describe("Processo de criacao e consulta de acompanhamentos", () => {
      it("Deve incluir 3 acompanhamentos como ADMINISTRADOR com sucesso", done => {
        let acompanhamentos = [
          {
            nome_acompanhamento: "Bacom",
            preco: 5,
            tipo_acompanhamento: "porção"
          },
          {
            nome_acompanhamento: "Provolone ralado",
            preco: 3,
            tipo_acompanhamento: "porção"
          },
          {
            nome_acompanhamento: "Chedar",
            preco: 6,
            tipo_acompanhamento: "porção"
          },
          
        ];
        let novosAcompanhamentosPromises = [];
        
        acompanhamentos.map(acompanhamento => {
          let promise = new Promise((resolve, reject) => {
            request(app)
              .post("/novoAcompanhamento")
              .type("json")
              .set("Context-type", "Application/json")
              .set("id_usuario", registroCriado.id_usuario)
              .set("id_estabelecimento", registroCriado.id_estabelecimento)
              .set("autorizacao", registroCriado.tokenDeAutenticacao)
              .send(acompanhamento)
              .then(res => {
                  let body = res.body
                
                expect(res.statusCode).to.equal(200);
                expect(body).to.have.own.property("nome_acompanhamento");
                expect(body).to.have.own.property("preco");
                expect(body).to.have.own.property("tipo_acompanhamento");
                expect(body.nome_acompanhamento).to.equal(acompanhamento.nome_acompanhamento);
                expect(body.preco).to.equal(acompanhamento.preco);
                return resolve();
              })
              .catch(err => reject(done(err)));
          });
          novosAcompanhamentosPromises.push(promise);
        });
        Promise.all(novosAcompanhamentosPromises).then(() => {
          done();
        });
      });
    //   it("Deve retornar 5 items", done => {
    //     request(app)
    //       .get("/buscarItems")
    //       .set("id_usuario", registroCriado.id_usuario)
    //       .set("id_estabelecimento", registroCriado.id_estabelecimento)
    //       .set("autorizacao", registroCriado.tokenDeAutenticacao)
    //       .then(res => {
    //         dadosCompartilhados.items = res.body;

    //         expect(res.statusCode).to.equal(200);
    //         expect(res.body).to.have.lengthOf(5);
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("Deve retornar um item pesquisado como usuario NÃO administrador", done => {
    //     request(app)
    //       .get(
    //         `/buscarItem/${dadosCompartilhados.items[0]._id}/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`
    //       )
    //       .set("id_usuario", usuarioCriado.usuario._id)
    //       .set("id_estabelecimento", usuarioCriado.estabelecimento._id)
    //       .set("autorizacao", usuarioCriado.autenticacao.tokenDeAutenticacao)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(200);
    //         expect(res.body).to.have.own.property("nome_item");
    //         expect(res.body).to.have.own.property("preco");
    //         expect(res.body.nome_item).to.equal(
    //           dadosCompartilhados.items[0].nome_item
    //         );
    //         expect(res.body.preco).to.equal(dadosCompartilhados.items[0].preco);
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("Deve retornar um ERRO ao incluir um item como usuario NÃO administrador", done => {
    //     let item = {
    //       nome_item: "Skol lata 350ml",
    //       preco: 3,
    //       categoria: "bebida",
    //       com_preparo: false,
    //       departamentos: "bar"
    //     };
    //     request(app)
    //       .post("/novoItem")
    //       .type("json")
    //       .set("Context-type", "Application/json")
    //       .set("id_usuario", usuarioCriado.usuario._id)
    //       .set("id_estabelecimento", usuarioCriado.estabelecimento._id)
    //       .set("autorizacao", usuarioCriado.autenticacao.tokenDeAutenticacao)
    //       .send(item)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(500);
    //         expect(res.body).to.have.own.property("Error");
    //         expect(res.body.Error).to.equal("Usuário não autorizado");
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("Deve retornar um ERRO ao incluir um item que já existe", done => {
    //     let item = {
    //       nome_item: "Itaipava lata 350ml",
    //       preco: 2.5,
    //       categoria: "bebida",
    //       com_preparo: false,
    //       departamentos: "bar",
    //       ex_dicas: 'ex. "Copos limpos"'
    //     };
    //     request(app)
    //       .post("/novoItem")
    //       .type("json")
    //       .set("Context-type", "Application/json")
    //       .set("id_usuario", registroCriado.id_usuario)
    //       .set("id_estabelecimento", registroCriado.id_estabelecimento)
    //       .set("autorizacao", registroCriado.tokenDeAutenticacao)
    //       .send(item)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(400);
    //         expect(res.body).to.have.own.property("Error");
    //         expect(res.body.Error).to.equal("O item já existe");
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    });
    // describe("Processo de atualização e remoção de items", () => {
    //   it("Deve ATUALIZAR um item com sucesso", done => {
    //     let item = {
    //       preco: 9
    //     };
    //     request(app)
    //       .put(
    //         `/editarItem/${dadosCompartilhados.items[0]._id}/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`
    //       )
    //       .type("json")
    //       .set("Context-type", "Application/json")
    //       .set("id_usuario", registroCriado.id_usuario)
    //       .set("id_estabelecimento", registroCriado.id_estabelecimento)
    //       .set("autorizacao", registroCriado.tokenDeAutenticacao)
    //       .send(item)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(200);
    //         expect(res.body).to.have.own.property("nome_item");
    //         expect(res.body).to.have.own.property("preco");
    //         expect(res.body.nome_item).to.equal(
    //           dadosCompartilhados.items[0].nome_item
    //         );
    //         expect(res.body.preco).to.not.equal(
    //           dadosCompartilhados.items[0].preco
    //         );
    //         expect(res.body.preco).to.equal(item.preco);
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("NÃO deve ATUALIZAR um item com um usuario NÃO administrador", done => {
    //     let item = {
    //       preco: 9
    //     };
    //     request(app)
    //       .put(
    //         `/editarItem/${dadosCompartilhados.items[0]._id}/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`
    //       )
    //       .type("json")
    //       .set("Context-type", "Application/json")
    //       .set("id_usuario", usuarioCriado.usuario._id)
    //       .set("id_estabelecimento", usuarioCriado.estabelecimento._id)
    //       .set("autorizacao", usuarioCriado.autenticacao.tokenDeAutenticacao)
    //       .send(item)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(500);
    //         expect(res.body).to.have.own.property("Error");
    //         expect(res.body.Error).to.equal("Usuário não autorizado");
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("Deve REMOVER um item com sucesso", done => {
    //     request(app)
    //       .delete(
    //         `/removerItem/${dadosCompartilhados.items[0]._id}/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`
    //       )
    //       .set("id_usuario", registroCriado.id_usuario)
    //       .set("id_estabelecimento", registroCriado.id_estabelecimento)
    //       .set("autorizacao", registroCriado.tokenDeAutenticacao)
    //       .then(res => {
    //         dadosCompartilhados.cardapio = res.body;
    //         expect(res.statusCode).to.equal(200);
    //         expect(res.body).to.have.own.property("_id");
    //         expect(res.body).to.have.own.property("items");
    //         expect(res.body._id).to.equal(
    //           dadosCompartilhados.usuarioCriado.estabelecimento.cardapio
    //         );
    //         expect(res.body.items).to.not.include(
    //           dadosCompartilhados.items[0]._id
    //         );
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("NÃO deve REMOVER um item com um usuario NÃO administrador", done => {
    //     request(app)
    //       .delete(
    //         `/removerItem/${dadosCompartilhados.items[0]._id}/${dadosCompartilhados.usuarioCriado.estabelecimento.cardapio}`
    //       )
    //       .set("id_usuario", usuarioCriado.usuario._id)
    //       .set("id_estabelecimento", usuarioCriado.estabelecimento._id)
    //       .set("autorizacao", usuarioCriado.autenticacao.tokenDeAutenticacao)
    //       .then(res => {
    //         expect(res.statusCode).to.equal(500);
    //         expect(res.body).to.have.own.property("Error");
    //         expect(res.body.Error).to.equal("Usuário não autorizado");
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    //   it("Deve retornar 4 items", done => {
    //     request(app)
    //       .get("/buscarItems")
    //       .set("id_usuario", registroCriado.id_usuario)
    //       .set("id_estabelecimento", registroCriado.id_estabelecimento)
    //       .set("autorizacao", registroCriado.tokenDeAutenticacao)
    //       .then(res => {
    //         dadosCompartilhados.items = res.body;
    //         expect(res.statusCode).to.equal(200);
    //         expect(res.body).to.have.lengthOf(4);
    //         done();
    //       })
    //       .catch(err => done(err));
    //   });
    // });
  });
};
