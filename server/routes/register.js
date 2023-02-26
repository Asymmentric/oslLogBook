const route=require('../server')
const validateRegistration=require('../util/pwdFunc').validateRegistration
const users=require('../db/userFunc')
const {registerFunc,generateToken,loginFunc,verifyToken}=require('../util/auth/authFunc')
const path=require('path')


route.get('/',(req,res)=>{
    console.log(req.headers['user-agent'])
    console.log(req.ip)
    console.log(req.url)
    res.send({Status:'OK',Response:200,Message:"Scan the QR Code to log your entry"})
})
route.get('/register',verifyToken,(req,res)=>{
    
    console.log('query@register',req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname,'../../client/register.html'))
})
route.get('/login',verifyToken,(req,res)=>{
    console.log('query@login',req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname,'../../client/login.html'))
})

route.get('/oslLog/api/v1/scan/entry',verifyToken,(req,res)=>{
    if(req.cookies.oslLogUser){
        usn=JSON.parse(req.cookies.oslLogUser).usn
        users.scanLog(usn,req.ip,req.headers['user-agent'])
        .then((msg)=>{
            console.log(msg);
            res.send({Code:msg.code,msg:msg.msg})
        })
        .catch((err)=>{
            console.log(err)
            res.send({msg:err.msg})
        })
    }
    else res.redirect('/register?redirect='+req.url)
})

route.post('/register',verifyToken,validateRegistration,registerFunc)

route.post('/login',validateRegistration,verifyToken,loginFunc)


module.exports=route