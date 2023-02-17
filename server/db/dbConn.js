const mongoose=require('mongoose')

const dbLink='mongodb+srv://tanishkaDb:Ze3wXDNXDvEBsD3q@cluster0.g2jxbm3.mongodb.net/?retryWrites=true&w=majority'

const dbConn=mongoose.connect(dbLink,{
    autoIndex:true,
    dbName:'test'
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
//mongo 1pwd=jr84Dsfsd93kg48sJ
//mongo user=osladmin 

// Correlation ID : a112ae99-db03-45a9-b7d4-8074067b6ae9 Azure