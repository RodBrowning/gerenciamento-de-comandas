const app = require('./app')
const conexaoComMongoDB = require('./conexaoComMongoDB')

const PORT = process.env.PORT || 2000

conexaoComMongoDB.open()
.then(()=>{
    app.listen(PORT,()=>{
        console.log("Running at http://localhost:"+PORT);
    })      
})
.catch(err=>{
    console.log("Erro ao conectar",err);
})


