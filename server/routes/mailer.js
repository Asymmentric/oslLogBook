const { userExists } = require("../db/userFunc/userFunc");
const { generateOTP, sendOTP } = require("../services/mailer")

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