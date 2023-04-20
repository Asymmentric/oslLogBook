const validateRegistration=require('../util/pwdFunc').validateRegistration
const users=require('../db/userFunc/userFunc')
const scan=require('../db/scanAndLog/qrScan')
const {registerFunc,generateToken,loginFunc,verifyToken}=require('../util/auth/authFunc')
const path=require('path')
const { getLastLogin } = require('../db/scanAndLog/livePage')


exports.homeFunc=(req,res)=>{

    console.log(req.headers['user-agent'])
    console.log(req.ip)
    console.log(req.url)
    // res.send({Status:'OK',Response:200,Message:"Scan the QR Code to log your entry"})
    res.send(`<center>
    <h1>Scan the QR Code to log your entry</h1>
    <img src='/client/QRCode.png'>
    </center>`)
}

exports.scanLogFunc=(req,res)=>{
    if(req.cookies.oslLogUser){
        usn=JSON.parse(req.cookies.oslLogUser).usn
        
        const userDateTime=new Date()
        let dayStart=new Date(userDateTime.getFullYear(),userDateTime.getMonth(),userDateTime.getDate())
        
        console.log(userDateTime)
        getLastLogin(usn)
        .then(lastLoginDetails=>{
            if(lastLoginDetails.lastLogin<dayStart) return scan.scanLog(usn,req.ip,req.headers['user-agent'],userDateTime)
            else return {lastLogin:lastLoginDetails.lastLogin}
        })
        .then((msg)=>{
            console.log(msg);
            // res.send({Code:msg.code,msg:msg.msg})
            res.redirect('/livepage')
        })
        .catch((err)=>{
            console.log(err)
            res.send({err:true,msg:err.msg})
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


