
const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv').config()

const favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, '../client/favicon.ico')))

const port=process.env.PORT || 9090

app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())

app.set('case sensitive routing ', true)
app.listen(port,()=>{
    console.log(__dirname)
    console.log(`Running on ${port}...`)
})
app.use('/client',express.static(path.join(__dirname,'../client')))
// app.use('/register',express.static(path.join(__dirname,'../client')))

module.exports=app 