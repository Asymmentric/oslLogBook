const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv').config()
const session=require('express-session')
const url=require('node:url')

const routes=require('./routes/route')
const handler=require('./util/handler/notFound')

const favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, '../client/favicon.ico')))

const port=process.env.PORT || 9090

app.use(cookieParser())

app.use(express.urlencoded())
app.use(express.json())

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
app.use((req,res,next)=>{
    let url=req.protocol + '://' + req.get('host') + req.originalUrl
    let currentUrl=new URL(url)
    req.data={
        baseUrl:currentUrl.origin
    }
    req.data.baseUrl=currentUrl.origin
    req.data.pathname=currentUrl.pathname
    next()
})
routes(app)

app.use('/client',express.static(path.join(__dirname,'../client')))

app.use('*',handler.notFound)

app.listen(port,()=>{
    
    console.log(`Running on ${port}...`)
})



module.exports=app 