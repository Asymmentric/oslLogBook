const validateRegistration = require('../util/pwdFunc').validateRegistration
const users = require('../db/userFunc/userFunc')
const scan = require('../db/scanAndLog/qrScan')
const { registerFunc, generateToken, loginFunc, verifyToken } = require('../util/auth/authFunc')
const path = require('path')
const { getLastLogin } = require('../db/scanAndLog/livePage')
const { locationVerification } = require('./geoLocation')
const jwt=require('jsonwebtoken')
const url=require('url')
const { getQueryParams } = require('../util/redirector')


exports.homeFunc = (req, res) => {

    console.log(req.headers['user-agent'])
    console.log(req.ip)
    console.log(req.url)
    // res.send({Status:'OK',Response:200,Message:"Scan the QR Code to log your entry"})
    res.sendFile(path.join(__dirname, '../../client/index.html'))
}

exports.scanLogFunc = (req, res) => {

    const userDateTime = new Date()
    let dayStart = new Date(userDateTime.getFullYear(), userDateTime.getMonth(), userDateTime.getDate())
    if (req.cookies.oslLogUser) {

        usn = JSON.parse(req.cookies.oslLogUser).usn
        console.log(userDateTime)
        getLastLogin(usn)
            .then(lastLoginDetails => {

                if (lastLoginDetails.newUser) return scan.scanLog(usn, req.ip, req.headers['user-agent'], userDateTime, true)

                else if (lastLoginDetails.userData.lastLogin < dayStart) return scan.scanLog(usn, req.ip, req.headers['user-agent'], userDateTime, false)
                else return { lastLogin: lastLoginDetails.userData.lastLogin }
            })
            .then((msg) => {
                console.log(msg);
                // res.send({Code:msg.code,msg:msg.msg})
                // res.send({err:false,redirect:`/livepage`})
                res.redirect('/livepage')
            })
            .catch((err) => {
                console.log(err)
                res.redirect('/logout')
            })
    }
    // else res.send({err:false,redirect:`/register?redirect=${req.url}`})
    else res.redirect(`/livepage?redirect=${req.url}`)



}

exports.renderRegister = (req, res) => {
    console.log('query@register', req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname, '../../client/register.html'))
}

exports.renderLogin = (req, res) => {
    console.log('query@login', req.query)
    // console.log(req)
    res.sendFile(path.join(__dirname, '../../client/login.html'))
}

exports.renderForgotPassword = (req, res) => {
    console.log('query@login', req.query)
    const { name, q, token } = req.query
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, result) => {
        if (!err) {
            console.log('jwt res-> ', result)
            res.sendFile(path.join(__dirname, '../../client/passwordReset.html'))
        }
        else res.redirect('/login')
    })
}

exports.todayEntries=(req,res)=>{
    console.log('query@login', req.query)
    res.sendFile(path.join(__dirname, '../../client/admin.html'))
}

exports.updateUserPassword=(req,res)=>{
    const {pwd2,pwd1,url}=req.body
    let urlQueryString=getQueryParams(url)
    jwt.verify(urlQueryString.token,process.env.JWT_SECRET_TOKEN,(err,result)=>{
        if(!err){
            console.log(`jwt res=>`,result)
            const email=result.email
            if(pwd2===pwd1) {
                users.resetUserPassword(email,pwd1)
                .then(msg=>{
                    console.log(msg)
                    res.send({err:false,redirect:`/login`})
                })
                .catch(err=>{
                    console.log(err)
                    res.send({err:true,msg:err.msg})
                })
            }
            else{
                
                res.send({err:true,msg:"Passwords do not match"})
            }
        }
        else{
            
            res.send({err:true,redirect:'/login',msg:'Invalid'})
        }
    })
    
    
}
