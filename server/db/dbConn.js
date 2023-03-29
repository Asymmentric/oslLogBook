const mongoose=require('mongoose')

const dbLink=process.env.db_LINK

const dbConn=mongoose.connect(dbLink,{
    autoIndex:true,
    dbName:process.env.db_NAME
})

dbConn.then(()=>{
    console.log('DB Connected')
})
dbConn.catch((err)=>{
    console.log(`\n- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
    console.log(err)
})

// module.exports=mongoClient
module.exports=dbConn
