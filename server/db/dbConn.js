const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const dbLink = process.env.NODE_ENV === 'dev' ? process.env.DB_LINK_DEV : process.env.DB_LINK
const dbName = process.env.NODE_ENV === 'dev' ? process.env.DB_NAME_DEV : process.env.DB_NAME

const dbConn = mongoose.connect(dbLink, {
    autoIndex: true,
    dbName
})

dbConn.then(() => {
    console.log('DB Connected')
})
dbConn.catch((err) => {
    console.log(dbLink)
    console.log(`- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
    console.log(err)
})

// module.exports=mongoClient
module.exports = dbConn
