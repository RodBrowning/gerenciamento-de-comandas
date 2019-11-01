// index, show, store, update, destroy.  
const ListItem = require('../../Models/ListItem')

module.exports = {
    async store(req, res){
        let novoListItem = {id_item, quantidade, id_usuario} = req.body,
            listItem = await ListItem.create(novoListItem)
        
        return res.json(listItem)
    },
    async update(req, res){
        let novoListItem = {id_item, quantidade, id_usuario} = req.body,
            listItem = await ListItem.findOne(novoListItem)
        // somar quantidade se listitem existir
        return res.json(listItem)
    }
}

