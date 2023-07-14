const register = require('./register')
const { registerFunc, generateToken, loginFunc, verifyToken, resetpassword } = require('../util/auth/authFunc')
const validation = require('../util/pwdFunc')
const livePage = require('./livePage')
const { routeSendOTP, routeVerifyOTP, routeSendForgotPasswordLink } = require('./mailer')
const { getLocationFunc, locationVerification } = require('./geoLocation')
const { logoutFunc, exitScanFunc } = require('./logout')
const { getTodayData, getAllData, getDataByDate } = require('../db/admin/getData')

module.exports = (app) => {
    app.get('/', register.homeFunc)

    app.get('/register', verifyToken, register.renderRegister)
    app.post('/register', verifyToken, validation.validateRegistration, registerFunc)

    app.get('/login', verifyToken, register.renderLogin)
    app.post('/login', validation.validateLogin, verifyToken, loginFunc)

    app.get('/oslLog/api/v1/scan/entry', verifyToken, register.scanLogFunc)


    // Out-time
    app.post('/oslLog/exit', exitScanFunc)

    app.get('/livepage', verifyToken, livePage.renderLivePage)
    app.post('/livepage', verifyToken, livePage.livePageFunc)

    app.post('/auth/route/type/otp/send', verifyToken, validation.validateRegistration, routeSendOTP)
    app.post('/auth/route/type/otp/verify', verifyToken, routeVerifyOTP)

    //reset password

    app.post('/auth/route/type/password/forgot', routeSendForgotPasswordLink)
    // app.get('/resetpassword',resetPasswordRenderFunc)
    app.get('/reset-password', register.renderForgotPassword)
    app.post('/updatepassword', register.updateUserPassword)

    //logout
    app.get('/logout', logoutFunc)

    //admin -get logs data
    app.get("/logs/today", verifyToken,register.todayEntries)
    app.get("/logs/all", (req, res) => {
        getAllData()
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                res.redirect('/')
            })
    })

    app.get('/admin/entries/today', (req, res) => {
        getTodayData()
            .then(result => {
                // console.log(result)
                let userDetails = result
                let final = []
                userDetails.forEach(user => {
                    console.log(user)
                    if (user.lastOut > user.lastLogin)
                        final.push({
                            Name: user.name,
                            Login: user.lastLogin,
                            Out: user.lastOut
                        })
                    else final.push({
                        Name: user.name,
                        Login: user.lastLogin,
                        Out: false

                    })
                });

                res.send(final)
            })
    })

    app.get('/admin/entries/:date', (req, res) => {
        console.log(req.params)
        getDataByDate(req.params.date)
            .then(result => {
                let userDetails = result
                let final = []
                userDetails.forEach(user => {
                    console.log(user)
                    final.push({
                        Name: user.name,
                        Login: user.filteredLogs[0].time,
                        Out: user.filteredLogs[1] ? user.filteredLogs[1].outTime : 0

                    })
                });
                console.log(final);
                res.send(final)
            })
    })



}