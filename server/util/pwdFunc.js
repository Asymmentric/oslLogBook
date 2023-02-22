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
    console.log(req.body)
    let {usn,email}=req.body

    if(!email) email=usn
    if(!usn) usn=email
    

    if(email && usn){
        const emailOK=(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)vvce\.ac\.in$/).test((email).toLowerCase())
        const usnOK=(/^4vv|4VV/).test(usn)
        if((emailOK && req.body.password) || usnOK && req.body.password) next()
        else return res.send({msg:'Invalid Email or USN'})

    // }else if(req.body.email){
    //     const emailOK=(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)vvce\.ac\.in$/).test((req.body.email).toLowerCase())
    //     if((emailOK && req.body.password) || usnOK && req.body.password) next()
    //     else return res.send({msg:'Invalid Email'})
    // }
    // else if(req.body.usn){
    //     const usnOK=(/^4vv|4VV/).test(req.body.usn)
    //     if(usnOK && req.body.password) next()
    //     else return res.send({msg:'Invalid USN'})
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