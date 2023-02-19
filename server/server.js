
const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')




app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())


app.listen(9090,()=>{
    console.log(__dirname)
    console.log(`Running on 9090`)
})
app.use('/login',express.static(path.join(__dirname,'../client')))
app.use('/register',express.static(path.join(__dirname,'../client')))

module.exports=app 