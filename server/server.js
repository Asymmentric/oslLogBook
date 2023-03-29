const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv').config()

const port=process.env.PORT || 9090

app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())

app.use('/client',express.static(path.join(__dirname,'../client')))

app.listen(port,()=>{
    
    console.log(`Running on 9090`)
})

module.exports=app 