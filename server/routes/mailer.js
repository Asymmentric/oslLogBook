const url = require('url')

const { userExists, userExistsResetPwd } = require("../db/userFunc/userFunc");
const { generateOTP, sendOTP, sendPasswordReset } = require("../services/mailer");
const { generateToken } = require("../util/auth/authFunc");

exports.routeSendOTP = async (req, res) => {
    let otp = generateOTP();
    const { email, name } = req.body
    let timeNow = new Date().getTime();

    req.session.otp = {
        otp,
        otpExpiryTime: new Date(timeNow + (5 * 60000))

    }
    console.log(req.session)
    userExists(req.body.usn, req.body.email)
        .then(() => sendOTP(email, name, otp))
        .then(msg => {
            console.log(msg)

            res.send({ err: msg.err, msg: msg.msg })
        })
        .catch(err => {
            console.log(err)
            res.send({ err: true, msg: err.msg })
        })

}

exports.routeVerifyOTP = async (req, res) => {
    let { otp } = req.body
    console.log('in otp verif', otp, req.session)
    let timeNow = new Date()
    console.log(timeNow)
    if (!req.session.otp) return res.send({ err: true, msg: 'Generate OTP' })
    if (req.session.otp.otp && req.session.otp.otpExpiryTime) {
        let otpExpiryTime = new Date(req.session.otp.otpExpiryTime)
        if (req.session.otp.otp === otp) {
            if (otpExpiryTime > timeNow) {
                res.send({ err: false, msg: 'OTP verified' })
            } else {

                res.send({ err: true, msg: 'OTP invalid, time out.' })
            }
        } else {
            res.send({ err: true, msg: 'Incorrect OTP' })
        }
    } else {
        res.send({ err: true, msg: 'Unknown Error occured. Try Again' })
    }

}

exports.routeSendForgotPasswordLink = async (req, res) => {
    try {
        const { q } = req.body
        const user = await userExistsResetPwd(q)
        let userDetail = user.user[0]
        const { name, email } = userDetail
        console.log(name, email)
        const token = await generateToken({ name, email })
        let searchParams = new url.URLSearchParams([
            ['q', q],
            ['name', name],
            ['token', token]
        ])
        let resetPasswordUrl = `${req.data.baseUrl}/reset-password?${searchParams.toString()}`
        console.log(resetPasswordUrl)

        const resetUrlSentStatus = await sendPasswordReset(name, email, resetPasswordUrl)
        res.send({err:false,msg:`Password reset link sent to your Email`})
    } catch (error) {
        console.log(error)
        res.send({ err: true, msg: `${error.msg}` })
    }

    //check if user exists
    //match details of name and query

    // generateToken({name,q})
    // .then(token=>{
    //     const resetPasswordUrl=`http://localhost:9090/reserpassword?q=${q}&name=${name}&token=${token}`
    //     return sendPasswordReset(name,q,token)
    // })
}