const { exitLog } = require("../db/scanAndLog/exitTime")
const { getLastLogin } = require("../db/scanAndLog/livePage")

exports.logoutFunc = (req, res) => {
    res.clearCookie('oslLogAuthUSN')
    res.clearCookie('oslLogUser')
    res.redirect('/')
}

exports.exitScanFunc = (req, res) => {
    const userDateTime = new Date()
    if (req.cookies.oslLogUser) {
        usn = JSON.parse(req.cookies.oslLogUser).usn
        getLastLogin(usn)
            .then(lastLoginDetails => {
                console.log("last->",lastLoginDetails.userData.currentLogStatus)
                if(lastLoginDetails.userData.lastLogin<userDateTime){
                    return exitLog(usn,userDateTime)
                }
                else return {lastOut:userDateTime}
            })
            .then(msg => {
                console.log(msg)
                if(!msg.currentLogStatus) res.send({err:false,msg})
                else res.send({ err: false, msg: msg.lastOut })
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