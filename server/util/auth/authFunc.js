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
            return generateToken(payLoad, false)

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

            return generateToken(payLoad, true)
        })
        .then(refreshToken => {
            res.cookie('refreshTokenOslLog', refreshToken, {
                httpOnly: true
            })


            if (queryParams) res.status(200).send({ err: false, redirect: queryParams.redirect })

            else res.status(200).send({ err: false, redirect: `/` })

        })

        .catch((err) => res.status(200).send({ err: true, msg: err.msg }))
}

const loginFunc = async (req, res) => {

    console.log(1234, 'login', req.url)

    let queryParams = req.headers.referer ? getQueryParams(req.headers.referer) : ''

    users.loginCheck(req.body.userId, req.body.password)

        .then((payLoad) => {
            oslLogUser = JSON.stringify({ usn: payLoad.usn, name: payLoad.name })
            res.cookie('oslLogUser', oslLogUser, {
                httpOnly: true
            })
            return generateToken(payLoad, false)
        })
        .then(token => {
            res.cookie('oslLogAuthUSN', token, {
                httpOnly: true
            })
            if (queryParams) res.status(200).send({ err: false, redirect: queryParams.redirect })

            else res.status(200).send({ err: false, redirect: `/` })

            console.log(queryParams)
        })

        .catch(err => res.send({ err: true, msg: err }))
}

const generateToken = async (payload, refresh) => {
    return new Promise((resolve, reject) => {

        let token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
            algorithm: 'HS384',
            expiresIn: '7d'
        })

        if (token) resolve(token)
    })
}

const verifyToken = async (req, res, next) => {
    console.log('989', req.headers.referer)

    let afterAuthUrls = ['/osllog/api/v1/scan/entry', '/livepage','/list/users/mods','/get/chatroom','/users/chatrooms','/users/chatrooms/allmessages']

    let moderatorUrls = ['/logs/today']

    if (req.cookies.oslLogAuthUSN) {
        const token = req.cookies.oslLogAuthUSN

        if (!token) return res.send({ msg: 'Authentication token missisng' })

        jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, result) => {

            err ? console.log('Error->', err) : console.log('jwt result->', result)

            if (!err) {
                try {
                    req.session.userUsn=result.usn
                    req.session.userRole = await userRoleAssign(result.usn);
                    if (afterAuthUrls.includes(req.url.toLowerCase())) next()

                    else if (moderatorUrls.includes(req.url.toLowerCase()) && (req.session.userRole === 'moderator')) next()

                    else res.redirect('/')
                } catch (err) {
                    console.log(err)
                    res.redirect('/')
                }
                
            }

            else {
                if (afterAuthUrls.includes(req.url.toLowerCase()) || moderatorUrls.includes(req.url.toLowerCase()) ) res.redirect(`/register?redirect=${req.url}`)
                else next()
            }
        })
    } else {
        if (afterAuthUrls.includes(req.url.toLowerCase()) || moderatorUrls.includes(req.url.toLowerCase()) ) res.redirect(`/login?redirect=${req.url}`)
        else {
            console.log(23);
            next()
        }
    }

}

const userRoleAssign = (usn) => {
    return new Promise((resolve, reject) => {
        users.userExistsResetPwd(usn)   //this function is used to check if user exists or not. Do not mind the function name
            .then(user => {
                resolve(user.user[0]['role'])
            })
            .catch(err => {
                console.log(err)
                reject({ err: true, msg: 'Unable to assign user role' })
            })
    })
}

module.exports = {
    registerFunc,
    loginFunc,
    verifyToken,
    generateToken
}