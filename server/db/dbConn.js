const mongoose=require('mongoose')
const dotenv=require('dotenv').config()

const dbLink=process.env.DB_LINK

const dbConn=mongoose.connect(dbLink,{
    autoIndex:true,
    dbName:process.env.DB_NAME
})

dbConn.then(()=>{
    console.log('DB Connected')
})
dbConn.catch((err)=>{
    console.log(`- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
    console.log(err)
})

// module.exports=mongoClient
module.exports=dbConn
