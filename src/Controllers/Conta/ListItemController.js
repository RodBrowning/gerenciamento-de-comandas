// index, show, store, update, destroy.  
const ListItem = require('../../Models/ListItem')
const LancamentoListItem = require('../../Models/lancamentoListItem')

module.exports = {
    async store(req, res){        
        let novoLancamentoListItem = { quantidade, id_usuario } = req.body,
            lancamentoListItem = await LancamentoListItem.create(novoLancamentoListItem)
         
        let novoListItem = {id_item} = req.body
        novoListItem.id_lancamentoListItem = lancamentoListItem._id

        let listItem = await ListItem.create(novoListItem)
        
        
        return res.json(listItem)
    },
    async update(req, res){
        let novoLancamentoListItem = { quantidade, id_usuario } = req.body,
            lancamentoListItem = await LancamentoListItem.create(novoLancamentoListItem)

        
        let {id_listItem_editar} = req.params,
            response = null

        response = await ListItem.findOneAndUpdate({_id: id_listItem_editar},{ $addToSet: { id_lancamentoListItem: lancamentoListItem._id } },{new:true})
        return res.json(response)
    },
    async destroy(req, res){
        let response = null,
            {id_listitem_remover} = req.params

        response =  await ListItem.findByIdAndDelete({_id: id_listitem_remover})

        return res.json(response)
    }
}

