const mongoose=require('mongoose')

const dbLink='mongodb://osladmin:jr84Dsfsd93kg48sJ@localhost:9091'

const dbConn=mongoose.connect(dbLink,{
    autoIndex:true,
    dbName:'test'
})

dbConn.then(()=>{
    console.log('DB Connected')
})
dbConn.catch((err)=>{
    console.log(`- - - - - - - - - - - - - Couldn't Connect - - - - - - - - - - - - - -\n`)
    console.log(err)
})

module.exports=dbConn
//mongo pwd=jr84Dsfsd93kg48sJ
//mongo user=osladmin