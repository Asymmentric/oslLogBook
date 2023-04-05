const validateRegistration=require('../util/pwdFunc').validateRegistration
const users=require('../db/userFunc/userFunc')
const scan=require('../db/scanAndLog/qrScan')
const {registerFunc,generateToken,loginFunc,verifyToken}=require('../util/auth/authFunc')
const path=require('path')


exports.homeFunc=(req,res)=>{

    console.log(req.headers['user-agent'])
    console.log(req.ip)
    console.log(req.url)
    // res.send({Status:'OK',Response:200,Message:"Scan the QR Code to log your entry"})
    res.send(`<center><h1>Scan the QR Code to log your entry</h1></center>`)
}

exports.scanLogFunc=(req,res)=>{
    if(req.cookies.oslLogUser){
        usn=JSON.parse(req.cookies.oslLogUser).usn
        
        const userDateTime=new Date()
        
        console.log(userDateTime)

        scan.scanLog(usn,req.ip,req.headers['user-agent'],userDateTime)
        .then((msg)=>{
            console.log(msg);
            // res.send({Code:msg.code,msg:msg.msg})
            res.send(`<center><h1>${msg.msg}</h1></center>`)
        })
        .catch((err)=>{
            console.log(err)
            res.send({msg:err.msg})
        })
    }
    else res.redirect('/register?redirect='+req.url)
}

exports.renderRegister=(req,res)=>{
    console.log('query@register',req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname,'../../client/register.html'))
}

exports.renderLogin=(req,res)=>{
    console.log('query@login',req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname,'../../client/login.html'))
}


