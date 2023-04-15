const livePage=require('../db/scanAndLog/livePage')
const path=require('path')
exports.renderLivePage=(req,res)=>{
    res.sendFile(path.join(__dirname,'../../client/livepage.html'))
}

exports.livePageFunc=(req,res)=>{
    let userid=JSON.parse(req.cookies.oslLogUser).usn

    livePage.getLastLogin(userid)
    .then(lastLoginDateAndTime=>{
        console.log(lastLoginDateAndTime)
        res.send({
            err:false,
            nameOfUser:lastLoginDateAndTime.name,
            lastLogin:lastLoginDateAndTime.lastLogin
        })
    })
    .catch(err=>{
        console.log(err.msg)
        res.redirect('/')
    })
    
}

