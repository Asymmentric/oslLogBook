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
    let {usn,email}=req.body

    if(!email) email=usn
    if(!usn) usn=email
    

    if(email && usn){
        const emailOK=(/^\w+([\.-]?\w+)*@vvce\.ac\.in$/is).test((email).toLowerCase())
        const usnOK=(/^(4vv|vvce)[a-z0-9]*\d$/is).test(usn)
        if((emailOK && req.body.password) || usnOK && req.body.password) next()
        else return res.send({msg:'Invalid Email or USN'})
    }
    else{
        return res.status(200).send({msg:'Missing email'})
    }
    
}


module.exports={
    encryptPwd,
    decryptPwd,
    validateRegistration
}