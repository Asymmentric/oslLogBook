const mongoose=require('mongoose')

const logSchema=new mongoose.Schema({
    time:{
        type:Date,
        default:Date.now()
    },
    outTime:{
        type:Date,
        default:Date.now()
    },
    useragent:String,
    ip:String
})

module.exports={
    logSchema
}