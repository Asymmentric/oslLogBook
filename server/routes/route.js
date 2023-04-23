const register = require('./register')
const { registerFunc, generateToken, loginFunc, verifyToken } = require('../util/auth/authFunc')
const validation = require('../util/pwdFunc')
const livePage = require('./livePage')
const { routeSendOTP, routeVerifyOTP } = require('./mailer')
const { getLocationFunc, locationVerification } = require('./geoLocation')

module.exports = (app) => {
    app.get('/', register.homeFunc)

    app.get('/register', verifyToken, register.renderRegister)
    app.post('/register', verifyToken, validation.validateRegistration,registerFunc)

    app.get('/login', verifyToken, register.renderLogin)
    app.post('/login', validation.validateLogin, verifyToken, loginFunc)

    app.get('/oslLog/api/v1/scan/entry',verifyToken, getLocationFunc)
    // app.get('/oslLog/api/v1/scan/entry3', verifyToken, register.scanLogFunc)
    app.post('/oslLog/api/v1/scan/entry2',verifyToken,register.scanLogFunc)
 
    

    app.get('/livepage',verifyToken, livePage.renderLivePage)
    app.post('/livepage', verifyToken, livePage.livePageFunc)

    app.post('/auth/route/type/otp/send',verifyToken,validation.validateRegistration,routeSendOTP)
    app.post('/auth/route/type/otp/verify',verifyToken,routeVerifyOTP)

    app.post('/auth/route/type/password/forgot',verifyToken,routeSendOTP)

    app.get('/admin/register')
    app.post('/admin/register')

    
}