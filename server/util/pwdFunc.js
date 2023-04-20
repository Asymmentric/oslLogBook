const bcrypt=require('bcrypt')
const saltRounds=10
let encryptPwd=(pwd)=>{
     return new Promise((resolve, reject) => {
            bcrypt.hash(pwd,saltRounds)
            .then((hash)=>{
                console.log('back',hash)
                resolve(hash)
            },(err)=>{
                console.log(err)
                reject(err)
            })
     })
    
}

let decryptPwd=(pwd,hash)=>{
    return bcrypt.compare(pwd,hash)
}

let validateRegistration=(req,res,next)=>{
    let {usn,email,name,password}=req.body
    
    if(email && usn && name){
        const emailOK=(/^\w+([\.-]?\w+)*@vvce\.ac\.in$/is).test((email).toLowerCase())
        const usnOK=(/^(4vv|vvce)[a-z0-9]*\d$/is).test(usn)
        if((emailOK && password) && (usnOK && password)) next()
        else return res.send({err:true,msg:'Invalid Email or USN'})
    }
    else{
        return res.status(200).send({err:true,msg:'Insufficient Data'})
    }
    
}

let validateLogin=(req,res,next)=>{
    let {userId}=req.body
    if(userId){
        const emailOK=(/^\w+([\.-]?\w+)*@vvce\.ac\.in$/is).test((userId).toLowerCase())
        const usnOK=(/^(4vv|vvce)[a-z0-9]*\d$/is).test(userId)
        if((emailOK && req.body.password) || (usnOK && req.body.password)) next()
        else return res.send({err:true,msg:'Invalid Email or USN'})
    }
    else{
        return res.send({err:true,msg:'Missing Email or USN'})
    }
}


module.exports={
    encryptPwd,
    decryptPwd,
    validateRegistration,
    validateLogin
}