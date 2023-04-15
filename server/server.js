const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv').config()
<<<<<<< HEAD

=======
const session=require('express-session')

const routes=require('./routes/route')
const handler=require('./util/handler/notFound')

const favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, '../client/favicon.ico')))

>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
const port=process.env.PORT || 9090

app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())

<<<<<<< HEAD
app.use('/client',express.static(path.join(__dirname,'../client')))

app.listen(port,()=>{
    
    console.log(`Running on 9090`)
=======
app.set('case sensitive routing ', true)

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave:false,
    cookie:{
        maxAge:oneDay
    }
}))

routes(app)

app.use('/client',express.static(path.join(__dirname,'../client')))

app.use('*',handler.notFound)

app.listen(port,()=>{
    console.log(__dirname)
    console.log(`Running on ${port}...`)
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
})

// app.use('/register',express.static(path.join(__dirname,'../client')))

module.exports=app 