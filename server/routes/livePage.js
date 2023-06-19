const livePage=require('../db/scanAndLog/livePage')
const path=require('path')
exports.renderLivePage=(req,res)=>{
    res.sendFile(path.join(__dirname,'../../client/livepage.html'))
}

exports.livePageFunc=(req,res)=>{
    let userid=JSON.parse(req.cookies.oslLogUser).usn

    livePage.getLastLogin(userid)
    .then(userLoginDetails=>{
        // console.log(userLoginDetails)
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
            time:userLoginDetails.userData.lastLogin,
            msg:'Exit at',
            status:userLoginDetails.userData.currentLogStatus
        })
        
    })
    .catch(err=>{
        console.log(err.msg)
        res.redirect('/')
    })
    
}

