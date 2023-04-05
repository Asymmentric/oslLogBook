const register = require('./register')
const { registerFunc, generateToken, loginFunc, verifyToken } = require('../util/auth/authFunc')
const validation = require('../util/pwdFunc')
const livePage = require('./livePage')

module.exports = (app) => {
    app.get('/', register.homeFunc)

    app.get('/register', verifyToken, register.renderRegister)
    app.post('/register', verifyToken, validation.validateRegistration, registerFunc)

    app.get('/login', verifyToken, register.renderLogin)
    app.post('/login', validation.validateRegistration, verifyToken, loginFunc)

    app.get('/oslLog/api/v1/scan/entry', verifyToken, register.scanLogFunc)
    

    app.get('/livepage', livePage.renderLivePage)
    app.post('/livepage', verifyToken, livePage.livePageFunc)


    
}