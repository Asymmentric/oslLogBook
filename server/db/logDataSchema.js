const mongoose=require('mongoose')

const logSchema=new mongoose.Schema({
    time:{
        type:Date
    },
    outTime:{
        type:Date
    },
    useragent:String,
    ip:String
})

module.exports={
    logSchema
}