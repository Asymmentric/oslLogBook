const jwt = require('jsonwebtoken')
const users = require('../../db/userFunc/userFunc')
const { getQueryParams } = require('../redirector')

const registerFunc = async (req, res) => {
    console.log(1234, req.url)

    let payLoad = { email: req.body.email, usn: req.body.usn }

    console.log('Payload', payLoad)

    let queryParams = req.headers.referer? getQueryParams(req.headers.referer) :''

    users.userExists(req.body.usn, req.body.email)
        .then(() => users.createUser(req.body.usn, req.body.name, req.body.email, req.body.password))
        .then((val) => {
            console.log(`- - - - VAL - - - -\n`, val)
            console.log(`- - - -PAYLOAD- - - -\n`, payLoad)
            return generateToken(payLoad)

        })
        .then(token => {
            console.log(token)
            res.cookie('oslLogAuthUSN', token, {
                httpOnly: true
            })
            oslLogUser = JSON.stringify({ usn: req.body.usn, name: req.body.name })
            res.cookie('oslLogUser', oslLogUser, {
                httpOnly: true
            })
<<<<<<< HEAD
            console.log('sdfsdfsdfsdfsdfsdfsd')
            res.status(200).send({err:false,msg:'OK'})
        })

        .catch((err) => res.status(400).send({err:true,msg: err}))
}

const loginFunc=async (req,res)=>{
    users.loginCheck(req.body.userId,req.body.password)
=======
            console.log(`\n it passed till her \n ${queryParams}`)

            if (queryParams) res.status(200).send({ err: false, redirect: queryParams.redirect })
            
            else res.status(200).send({ err: false, redirect: `/` })



        })

        .catch((err) => res.status(200).send({ err:true,msg: err.msg }))
}

const loginFunc = async (req, res) => {
    // console.log(1234, 'referee at login', req.headers.referer.split('?redirect='))

    console.log(1234, 'login', req.url)

    let queryParams = req.headers.referer? getQueryParams(req.headers.referer) :''
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f

    users.loginCheck(req.body.userId, req.body.password)

        .then((payLoad) => {
            oslLogUser = JSON.stringify({ usn: payLoad.usn, name: payLoad.name })
            res.cookie('oslLogUser', oslLogUser, {
                httpOnly: true
            })
            return generateToken(payLoad)
        })
        .then(token => {
            res.cookie('oslLogAuthUSN', token, {
                httpOnly: true
            })


            console.log(queryParams)

            if (queryParams) res.status(200).send({ err: false, redirect: queryParams.redirect })
            
            else res.status(200).send({ err: false, redirect: `/` })

            console.log(queryParams)
        })
<<<<<<< HEAD
        oslLogUser=JSON.stringify({usn:req.body.userId})
            res.cookie('oslLogUser',oslLogUser,{
                httpOnly:true
            })
        res.send({err:false,msg:"Login success"})
    })

    .catch(err=>res.send({err:true,msg:err}))
=======

        .catch(err => res.send({ err:true,msg: err }))
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
}

const generateToken = async (payload) => {
    return new Promise((resolve, reject) => {
<<<<<<< HEAD
        let token=jwt.sign(payload,process.env.JWT_SECRET,{
            algorithm:'HS384',
            expiresIn:'7d'
=======
        let token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
            algorithm: 'HS384',
            expiresIn: '7d'
>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
        })

        if (token) resolve(token)
    })
}

<<<<<<< HEAD
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
    
=======
const verifyToken = (req, res, next) => {
    console.log('989', req.headers.referer)

    if (req.cookies.oslLogAuthUSN) {
        const token = req.cookies.oslLogAuthUSN
        if (!token) return res.send({ msg: 'Authentication token missisng' })
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, result) => {
            console.log('jwt res-> ', result)
            if (!err) {
                if ((req.url === '/oslLog/api/v1/scan/entry') || (req.url === '/livepage')) next();
                // else if(queryParams.redirect) res.redirect(queryParams.redirect)
                else res.redirect('/')
            }
            /*
            //this sends error as response
            else return res.send(err)   
            */
            else {
                if ((req.url === '/oslLog/api/v1/scan/entry') || (req.url === '/livepage')) res.redirect(`/register?redirect=${req.url}`)
                else next()
            }
        })
    } else {
        if ((req.url === '/oslLog/api/v1/scan/entry') || (req.url === '/livepage')) res.redirect(`/login?redirect=${req.url}`)
        else {
            console.log(23);
            next()
        }
    }

>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
}


module.exports = {
    registerFunc,
    loginFunc,
    verifyToken
}