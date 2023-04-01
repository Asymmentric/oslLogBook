const jwt=require('jsonwebtoken')
const users = require('../../db/userFunc')
const {getQueryParams}=require('../redirector')

const registerFunc = async (req, res) => {
    console.log(1234,req.url)
    let payLoad={email:req.body.email,usn:req.body.usn}
    console.log('Payload',payLoad)
    let queryParams=getQueryParams(req.headers.referer)
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
            if(queryParams.redirect) res.redirect(queryParams.redirect)
            else res.redirect('/')
        
        })

        .catch((err) => res.status(400).send({ msg:err.msg}))
}

const loginFunc=async (req,res)=>{
    console.log(1234,'referee at login',req.headers.referer.split('?redirect='))
    console.log(1234,'login',req.url)
    let queryParams=getQueryParams(req.headers.referer)
    users.loginCheck(req.body.usn,req.body.password)

    .then((payLoad)=>{
        oslLogUser=JSON.stringify({usn:payLoad.usn,name:payLoad.name})
            res.cookie('oslLogUser',oslLogUser,{
                httpOnly:true
            })
        return generateToken(payLoad)
    })
    .then(token=>{
        res.cookie('oslLogAuthUSN',token,{
            httpOnly:true
        })
        
        
        console.log(queryParams)
        if(queryParams.redirect) res.redirect(queryParams.redirect)
        else {console.log('to home');res.redirect('/')}
        console.log(queryParams)
    })

    .catch(err=>res.send({msg:err}))
}

const generateToken=async(payload)=>{
    return new Promise((resolve, reject) => {
        let token=jwt.sign(payload,process.env.JWT_SECRET_TOKEN,{
            algorithm:'HS384',
            expiresIn:'7d'
        })

        if(token) resolve(token)
    })
}

const verifyToken=(req,res,next)=>{
    console.log('989',req.headers.referer)
    
    if(req.cookies.oslLogAuthUSN){
        const token=req.cookies.oslLogAuthUSN
    if(!token) return res.send({msg:'Authentication token missisng'})
    jwt.verify(token,process.env.JWT_SECRET_TOKEN,(err,result)=>{
        console.log('jwt res-> ',result)
        if(!err) {
            if(req.url==='/oslLog/api/v1/scan/entry') next();
            // else if(queryParams.redirect) res.redirect(queryParams.redirect)
            else res.redirect('/')
        }
        /*
        //this sends error as response
        else return res.send(err)   
        */
       else {
        if(req.url==='/oslLog/api/v1/scan/entry') res.redirect(`/register?redirect=${req.url}`)
        else next()
       } 
    })
    }else {
        if(req.url==='/oslLog/api/v1/scan/entry') res.redirect(`/login?redirect=${req.url}`) 
        else{
            console.log(23);
            next()
        }
    }
    
}


module.exports = {
    registerFunc,
    loginFunc,
    verifyToken
}