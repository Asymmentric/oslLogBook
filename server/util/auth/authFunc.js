const jwt=require('jsonwebtoken')
const users = require('../../db/userFunc')


const registerFunc = async (req, res) => {
    let payLoad={email:req.body.email,usn:req.body.usn}
    console.log('Payload',payLoad)
    users.userExists(req.body.usn, req.body.email)
        .then(() => users.createUser(req.body.usn, req.body.name, req.body.email, req.body.password))
        .then((val) =>{
            console.log(`- - - - VAL - - - -\n`,val)
            console.log(`- - - -PAYLOAD- - - -\n`,payLoad)
            return generateToken(payLoad)
            
        })
        .then(token=>{
            console.log(token)
            res.cookie('oslLogAuthUSN',token,{
                httpOnly:true
            })
            oslLogUser=JSON.stringify({usn:req.body.usn,name:req.body.name})
            res.cookie('oslLogUser',oslLogUser,{
                httpOnly:true
            })
            console.log('sdfsdfsdfsdfsdfsdfsd')
            res.status(200).send({err:false,msg:'OK'})
        })

        .catch((err) => res.status(400).send({err:true,msg: err}))
}

const loginFunc=async (req,res)=>{
    users.loginCheck(req.body.userId,req.body.password)

    .then((payLoad)=>generateToken(payLoad))

    .then(token=>{
        res.cookie('oslLogAuthUSN',token,{
            httpOnly:true
        })
        oslLogUser=JSON.stringify({usn:req.body.userId})
            res.cookie('oslLogUser',oslLogUser,{
                httpOnly:true
            })
        res.send({err:false,msg:"Login success"})
    })

    .catch(err=>res.send({err:true,msg:err}))
}

const generateToken=async(payload)=>{
    return new Promise((resolve, reject) => {
        let token=jwt.sign(payload,process.env.JWT_SECRET,{
            algorithm:'HS384',
            expiresIn:'7d'
        })

        if(token) resolve(token)
    })
}

const verifyToken=(req,res,next)=>{
    
    if(req.cookies.oslLogAuthUSN){
        const token=req.cookies.oslLogAuthUSN
    if(!token) return res.send({err:true,msg:'Authentication token missisng'})

    jwt.verify(token,process.env.JWT_SECRET,(err,result)=>{
        console.log('jwt res-> ',result)
        if(!err) {
            res.redirect('/oslLog/api/v1/scan/entry')
        }
        else {return next()}
    })

    }else {console.log(23);
        return next()}
    
}


module.exports = {
    registerFunc,
    loginFunc,
    verifyToken
}