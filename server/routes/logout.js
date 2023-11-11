const { setUserActivityStatus } = require("../db/chatFunc/chatRoom")
const { exitLog } = require("../db/scanAndLog/exitTime")
const { getLastLogin } = require("../db/scanAndLog/livePage")

exports.logoutFunc = async (req, res) => {
    res.clearCookie('oslLogAuthUSN')
    res.clearCookie('oslLogUser')
    res.clearCookie('connect.sid')
    await setUserActivityStatus(req.session.userUsn)
    req.session.destroy()
    res.redirect('/')
}

exports.exitScanFunc = (req, res) => {
    const userDateTime = new Date()
    if (req.cookies.oslLogUser) {
        usn = JSON.parse(req.cookies.oslLogUser).usn
        getLastLogin(usn)
            .then(lastLoginDetails => {
                console.log("last->", lastLoginDetails.userData.currentLogStatus)
                if (lastLoginDetails.userData.lastLogin < userDateTime) {
                    console.log(`Logging...`)
                    return exitLog(usn, userDateTime,lastLoginDetails.userData.lastLogin)
                }
                else {
                    console.log(`parse`)
                    return { lastOut: userDateTime }}
            })
            .then(msg => {
                return getLastLogin(usn)
                // console.log(msg)
                // if (!msg.currentLogStatus) res.send({ err: false, msg:msg.lastLogin })
                // else res.send({ err: false, msg: msg.lastOut })
            })
            .then(userLoginDetails=>{
                if(userLoginDetails.userData.currentLogStatus)  res.send({
                    err:false,
                    nameOfUser:userLoginDetails.userData.name,
                    time:userLoginDetails.userData.lastLogin,
                    msg:'Last Logged at',
                    status:userLoginDetails.userData.currentLogStatus
                })
                else res.send({
                    err:false,
                    nameOfUser:userLoginDetails.userData.name,
                    time:userLoginDetails.userData.lastOut,
                    msg:'Exit at',
                    status:userLoginDetails.userData.currentLogStatus
                })
                
            })
            .catch(err => {
                console.log(err)
                res.send({ err: true, msg: err.msg })
            })
    }
    else {
        res.send({ err: true, redirect: '/register' })
    }

}