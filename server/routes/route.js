const register = require('./register')
const { registerFunc, generateToken, loginFunc, verifyToken, resetpassword  } = require('../util/auth/authFunc')
const validation = require('../util/pwdFunc')
const livePage = require('./livePage')
const { routeSendOTP, routeVerifyOTP, routeSendForgotPasswordLink } = require('./mailer')
const { getLocationFunc, locationVerification } = require('./geoLocation')

module.exports = (app) => {
    app.get('/', register.homeFunc)

    app.get('/register', verifyToken, register.renderRegister)
    app.post('/register', verifyToken, validation.validateRegistration,registerFunc)

    app.get('/login', verifyToken, register.renderLogin)
    app.post('/login', validation.validateLogin, verifyToken, loginFunc)

    // app.get('/oslLog/api/v1/scan/entry',verifyToken, getLocationFunc)
    // app.get('/oslLog/api/v1/scan/entry3', verifyToken, register.scanLogFunc)
    app.get('/oslLog/api/v1/scan/entry',verifyToken,register.scanLogFunc)
 
    

    app.get('/livepage',verifyToken, livePage.renderLivePage)
    app.post('/livepage', verifyToken, livePage.livePageFunc)

    app.post('/auth/route/type/otp/send',verifyToken,validation.validateRegistration,routeSendOTP)
    app.post('/auth/route/type/otp/verify',verifyToken,routeVerifyOTP)

    //reset password
    
    app.post('/auth/route/type/password/forgot',routeSendForgotPasswordLink)
    // app.get('/resetpassword',resetPasswordRenderFunc)
    app.get('/reset-password',register.renderForgotPassword)
    app.post('/updatepassword',register.updateUserPassword)

    app.get('/admin/register')
    app.post('/admin/register')

    
}