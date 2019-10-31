const express = require('express')
const RotasAutenticacao = require('./Routes/RotasAutenticacao')
const routes = require('./router')
const mongoose = require('mongoose')


const dbPath = "mongodb://127.0.0.1:27017/ContaDeBarApp?gssapiServiceName=mongodb"
mongoose.connect(dbPath,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const app = express()
app.use(express.json())

app.use('/auth/',RotasAutenticacao)
app.use('/',routes)

const PORT = 2000
app.listen(PORT)
console.log("Running at http://localhost:"+PORT);
