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
<<<<<<< HEAD
    console.log(req.body)
    if(req.body.userId){
        const emailOK=(/^[a-zA-Z0-9+_.-]+@vvce\.ac\.in$/).test((req.body.userId).toLowerCase())
        const usnOK=(/^4vv|4VV/).test(req.body.userId)
        console.log(`USN: ${usnOK}\n Email: ${emailOK}\n`)
        if((emailOK && req.body.password) || (usnOK && req.body.password)) next()
        else return res.send({err:true,msg:'Invalid Email or USN'})
    }
    else if(req.body.usn && req.body.email){
        console.log('register')
        const emailOK=(/^[a-zA-Z0-9+_.-]+@vvce\.ac\.in$/).test((req.body.email).toLowerCase())
        const usnOK=(/^4vv|4VV/).test(req.body.usn)

        console.log(`USN: ${usnOK}\n Email: ${emailOK}\n`)
=======
    let {usn,email}=req.body

    if(!email) email=usn
    if(!usn) usn=email
    

    if(email && usn){
        const emailOK=(/^\w+([\.-]?\w+)*@vvce\.ac\.in$/is).test((email).toLowerCase())
        const usnOK=(/^(4vv|vvce)[a-z0-9]*\d$/is).test(usn)
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
        if((emailOK && req.body.password) || usnOK && req.body.password) next()
        else return res.send({err:true,msg:'Invalid Email or USN'})
    }
    else{
        return res.status(200).send({err:true,msg:'Missing email'})
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