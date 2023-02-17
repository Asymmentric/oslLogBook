const mongoose=require('mongoose')

// const dbLink='mongodb://osladmin:jr84Dsfsd93kg48sJ@localhost:9091'

const dbLink=`mongodb://logbookosl:uoN9adNHZD0MHLpEXsUjjy64ADq6KZQFhNw0geIF7Jj2WAmpPsftNU5mxyz4BUQlIoxZVrGHI6N4ACDb0XpZCQ%3D%3D@logbookosl.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@logbookosl@`

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