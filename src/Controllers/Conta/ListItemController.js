// index, show, store, update, destroy.  
const ListItem = require('../../Models/ListItem')

module.exports = {
    async store(req, res){
        let novoListItem = {id_item, quantidade, id_usuario} = req.body,
            listItem = await ListItem.create(novoListItem)
        
        // atualizar se ja existir
        return res.json(listItem)
    },
    async update(req, res){
        let listItemAtualizar = {id_item, quantidade, id_usuario} = req.body,
            {id_listItem_editar} = req.params,
            response = null

        response = await ListItem.findOneAndUpdate({_id: id_listItem_editar},listItemAtualizar,{new:true})
        return res.json(response)
    },
    async destroy(req, res){
        let response = null,
            {id_listitem_remover} = req.params

        response =  await ListItem.findByIdAndDelete({_id: id_listitem_remover})

        return res.json(response)
    }
}

