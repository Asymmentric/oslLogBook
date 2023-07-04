const jwt = require('jsonwebtoken')
const users = require('../../db/userFunc/userFunc')
const { getQueryParams } = require('../redirector')
const { renderForgotPassword } = require('../../routes/register')

const registerFunc = async (req, res) => {
    console.log(1234, req.url)

    let payLoad = { email: req.body.email, usn: req.body.usn }

    console.log('Payload', payLoad)

    let queryParams = req.headers.referer ? getQueryParams(req.headers.referer) : ''

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
            console.log(`\n it passed till her \n ${queryParams}`)

            if (queryParams) res.status(200).send({ err: false, redirect: queryParams.redirect })

            else res.status(200).send({ err: false, redirect: `/` })



        })

        .catch((err) => res.status(200).send({ err: true, msg: err.msg }))
}

const loginFunc = async (req, res) => {
    // console.log(1234, 'referee at login', req.headers.referer.split('?redirect='))

    console.log(1234, 'login', req.url)

    let queryParams = req.headers.referer ? getQueryParams(req.headers.referer) : ''

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

        .catch(err => res.send({ err: true, msg: err }))
}

const generateToken = async (payload) => {
    return new Promise((resolve, reject) => {
        let token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
            algorithm: 'HS384',
            expiresIn: '1h'
        })

        if (token) resolve(token)
    })
}

const verifyToken = (req, res, next) => {
    console.log('989', req.headers.referer)
    let afterAuthUrls = ['/osllog/api/v1/scan/entry', '/livepage']
    if (req.cookies.oslLogAuthUSN) {
        const token = req.cookies.oslLogAuthUSN
        if (!token) return res.send({ msg: 'Authentication token missisng' })
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, result) => {
            console.log('jwt res-> ', result)
            if (!err) {
                console.log(req.url)

                if (afterAuthUrls.includes(req.url.toLowerCase())) next()

                else res.redirect('/')
            }

            else {
                if (afterAuthUrls.includes(req.url.toLowerCase())) res.redirect(`/register?redirect=${req.url}`)
                else next()
            }
        })
    } else {
        if (afterAuthUrls.includes(req.url.toLowerCase())) res.redirect(`/login?redirect=${req.url}`)
        else {
            console.log(23);
            next()
        }
    }

}

// const resetPasswordRenderFunc=async(req,res)=>{
//     const {name,q,token}=req.query
//     jwt.verify(token,process.env.JWT_SECRET_TOKEN,(err,result)=>{
//         if(!err){
//             console.log('jwt res-> ', result)
//             res.redirect('/reset-password?q=')
//         }
//         else res.redirect('/login')
//     })

// }

module.exports = {
    registerFunc,
    loginFunc,
    verifyToken,
    generateToken
}