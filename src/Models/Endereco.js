const mongoose = require('mongoose')

const EnderecoSchema = new mongoose.Schema({
    rua: String,
    numero: Number,
    bairro: String,
    CEP: String,
    estado: String,
    uf: String,
    cidade: String,
    pais: String
})


module.exports = mongoose.model("Endereco", EnderecoSchema)