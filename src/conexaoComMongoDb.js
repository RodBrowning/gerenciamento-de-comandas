
const mongoose = require('mongoose')
const dbPath = "mongodb://127.0.0.1:27017/ContaDeBarApp?gssapiServiceName=mongodb"
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongod = new MongoMemoryServer();


module.exports = {
    open(){
        return new Promise(async (resolve, reject)=>{
            if(process.env.NODE_ENV === 'test'){
                const uri = await mongod.getConnectionString()
                mongoose.connect(uri,{
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                })
                .then(()=>{resolve()})
                .catch(err=>{reject(err)})

            } else {
                mongoose.connect(dbPath,{
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                })
                .then(()=>{
                    resolve() 
                })
                .catch(err=>{
                    reject(err)
                })
            }
        })
    },
    async close(){
        await mongoose.disconnect()
        await mongod.stop();
    }
}
