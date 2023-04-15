const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

<<<<<<< HEAD
const dbLink=process.env.db_LINK

const dbConn=mongoose.connect(dbLink,{
    autoIndex:true,
    dbName:process.env.db_NAME
=======
const dbLink = process.env.NODE_ENV === 'dev' ? process.env.DB_LINK_DEV : process.env.DB_LINK
const dbName = process.env.NODE_ENV === 'dev' ? process.env.DB_NAME_DEV : process.env.DB_NAME

const dbConn = mongoose.connect(dbLink, {
    autoIndex: true,
    dbName
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
})

dbConn.then(() => {
    console.log('DB Connected')
})
<<<<<<< HEAD
dbConn.catch((err)=>{
    console.log(`\n- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
=======
dbConn.catch((err) => {
    console.log(dbLink)
    console.log(`- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
    console.log(err)
})

// module.exports=mongoClient
<<<<<<< HEAD
module.exports=dbConn
=======
module.exports = dbConn
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
