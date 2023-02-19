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
            res.redirect('/')
        })

        .catch((err) => res.status(400).send({ err}))
}

const loginFunc=async (req,res)=>{
    
    users.loginCheck(req.body.usn,req.body.password)

    .then((payLoad)=>generateToken(payLoad))

    .then(token=>{
        res.cookie('oslLogAuthUSN',token,{
            httpOnly:true
        })
        
        res.redirect('/')
        
    })

    .catch(err=>res.send({msg:err}))
}

const generateToken=async(payload)=>{
    return new Promise((resolve, reject) => {
        let token=jwt.sign(payload,'abc',{
            algorithm:'HS384',
            expiresIn:'7d'
        })

        if(token) resolve(token)
    })
}

const verifyToken=(req,res,next)=>{
    
    if(req.cookies.oslLogAuthUSN){
        const token=req.cookies.oslLogAuthUSN
    if(!token) return res.send({msg:'Authentication token missisng'})
    jwt.verify(token,'abc',(err,result)=>{
        console.log('jwt res-> ',result)
        if(!err) {
            res.redirect('/')
        }
        /*
        //this sends error as response
        else return res.send(err)   
        */
       else next()
    })
    }else {console.log(23);next()}
    
}


module.exports = {
    registerFunc,
    loginFunc,
    verifyToken
}