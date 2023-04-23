const validateRegistration = require('../util/pwdFunc').validateRegistration
const users = require('../db/userFunc/userFunc')
const scan = require('../db/scanAndLog/qrScan')
const { registerFunc, generateToken, loginFunc, verifyToken } = require('../util/auth/authFunc')
const path = require('path')
const { getLastLogin } = require('../db/scanAndLog/livePage')
const { locationVerification } = require('./geoLocation')


exports.homeFunc = (req, res) => {

    console.log(req.headers['user-agent'])
    console.log(req.ip)
    console.log(req.url)
    // res.send({Status:'OK',Response:200,Message:"Scan the QR Code to log your entry"})
    res.send(`<center>
    <h1>Registrations before 20 Apr 2023 are not valid. Please Register again.</h1>
    <h1>Scan the QR Code to log your entry</h1>
    <img src='/client/QRCode.png'>
    </center>`)
}

exports.scanLogFunc = (req, res) => {
    const { latitude, longitude, geoLocTime } = req.body;
    const userDateTime = new Date()
    let dayStart = new Date(userDateTime.getFullYear(), userDateTime.getMonth(), userDateTime.getDate())
    locationVerification(latitude, longitude)
        .then(msg => {
            if (req.cookies.oslLogUser) {
                usn = JSON.parse(req.cookies.oslLogUser).usn
                console.log(userDateTime)
                return getLastLogin(usn)
            }
            else res.send({err:false,redirect:`/register?redirect=${req.url}`})
        })
        .then(lastLoginDetails => {

            if (lastLoginDetails.newUser) return scan.scanLog(usn, req.ip, req.headers['user-agent'], userDateTime, true)

            else if (lastLoginDetails.userData.lastLogin < dayStart) return scan.scanLog(usn, req.ip, req.headers['user-agent'], userDateTime, false)
            else return { lastLogin: lastLoginDetails.userData.lastLogin }
        })
        .then((msg) => {
            console.log(msg);
            // res.send({Code:msg.code,msg:msg.msg})
            res.send({err:false,redirect:`/livepage`})
        })
        .catch((err) => {
            console.log(err)
            res.send({err:true,write:`<center>
            <h3>
                If you're seeing this...
            </h3>
            <h5>
                It seeems you tried scanning the QR code from outside OSL.
            </h5>
        </center>`})
        })

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


