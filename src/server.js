const app = require('./app')
const conexaoComMongoDb = require('./conexaoComMongoDb')

const PORT = process.env.PORT || 2000

conexaoComMongoDb.open()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log("Running at http://localhost:"+PORT);
        })      
    })


