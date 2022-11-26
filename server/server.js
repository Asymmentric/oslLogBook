
const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')



app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())


app.listen(9090,()=>{
    console.log(path.join(__dirname,'../client'))
    console.log(`Running on 9090`)
})

module.exports=app 