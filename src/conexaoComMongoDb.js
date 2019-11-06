
const mongoose = require('mongoose')
const dbPath = "mongodb://127.0.0.1:27017/ContaDeBarApp?gssapiServiceName=mongodb"

module.exports = {
    open(){
        return new Promise((resolve, reject)=>{
            mongoose.connect(dbPath,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            .then((res, err)=>{
                err ? reject(err) : resolve(res)
            })
        })
    },
    close(){
        return mongoose.disconnect()
    }
}


