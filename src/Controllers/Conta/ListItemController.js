// index, show, store, update, destroy.
const ListItem = require("../../Models/ListItem");
const Item = require("../../Models/Item");
const LancamentoListItem = require("../../Models/lancamentoListItem");
const Conta = require("../../Models/Conta");

module.exports = {
  async store(req, res) {
    let { quantidade, id_item } = req.body,
      { id_usuario } = req.headers,
      { id_conta } = req.params,
      lancamentoListItem = null,
      item = null,
      novoListItem = null,
      response = null,
      conta = null,
      total = null,
      statusCode = 200;

    lancamentoListItem = await LancamentoListItem.create({
      quantidade,
      id_usuario
    });
    item = await Item.findById({ _id: id_item }, { preco: 1 });
    novoListItem = {
      id_item,
      id_lancamentoListItem: [lancamentoListItem._id],
      quantidadeTotal: quantidade,
      subTotal: quantidade * item.preco
    };
    
    response = await ListItem.create(novoListItem);
    
    conta = await Conta.findByIdAndUpdate(
      { _id: id_conta },
      { $push: { listItems: response._id } },
      { new: true }
    );
    [total] = await ListItem.aggregate([
      { $match: { _id: { $in: conta.listItems } } },
      { $group: { _id: conta._id, total_conta: { $sum: "$subTotal" } } }
    ]);
    await Conta.findByIdAndUpdate(
      { _id: id_conta },
      { $set: { total_conta: total.total_conta } },
      { new: true }
    );

    return res.status(statusCode).json(response);
  },
  async update(req, res) {
    let { quantidade, id_item } = req.body,
      { id_usuario } = req.headers,
      { id_listItem_editar, id_conta_editar } = req.params,
      item = null,
      updatesListItem = null,
      subTotal = null,
      conta = null,
      response = null,
      lancamentoListItem = null,
      statusCode = 200;

    lancamentoListItem = await LancamentoListItem.create({
      quantidade,
      id_usuario
    });
    updatedListItem = await ListItem.findOneAndUpdate(
      { _id: id_listItem_editar },
      { $addToSet: { id_lancamentoListItem: lancamentoListItem._id } },
      { new: true }
    );
    [totalItemsLancados] = await LancamentoListItem.aggregate([
      { $match: { _id: { $in: updatedListItem.id_lancamentoListItem } } },
      {
        $group: {
          _id: updatedListItem._id,
          quantidadeTotal: { $sum: "$quantidade" }
        }
      }
    ]);
    item = await Item.findById({ _id: id_item }, { preco: 1 });
    subTotal = item.preco * totalItemsLancados.quantidadeTotal;

    response = await ListItem.findOneAndUpdate(
      { _id: id_listItem_editar },
      {
        $set: { quantidadeTotal: totalItemsLancados.quantidadeTotal, subTotal }
      },
      { new: true }
    );

    conta = await Conta.findById({ _id: id_conta_editar });
    [totalConta] = await ListItem.aggregate([
      { $match: { _id: { $in: conta.listItems } } },
      { $group: { _id: conta._id, total_conta: { $sum: "$subTotal" } } }
    ]);
    await Conta.findByIdAndUpdate(
      { _id: id_conta_editar },
      { $set: { total_conta: totalConta.total_conta } },
      { new: true }
    );

    return res.status(statusCode).json(response);
  },
  async destroy(req, res) {
    let response = null,
      { id_listitem_remover } = req.params;

    response = await ListItem.findByIdAndDelete({ _id: id_listitem_remover });

    return res.json(response);
  }
};
