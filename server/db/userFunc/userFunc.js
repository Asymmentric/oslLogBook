const { users } = require('../userSchema')
const cryptPwd = require('../../util/pwdFunc')

async function createUser(usn, name, email, password) {
    const finalPassword = await cryptPwd.encryptPwd(password)
    return new Promise((resolve, reject) => {
        const user = new users({
            usn: usn.toLowerCase(),
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password: finalPassword
        })

        user.save()
            .then((msg) => {
                console.log(msg)
                resolve(`Added ${name} - USN:${usn}`)
            })
            .catch((err) => {
                console.log(err)
                reject(`Couldn't Register. Try Again`)
            })
    })
}

async function userExists(usn, email, resetPwd) {
    let user = await users.find({ $or: [{ email: email }, { usn: usn }] })
    return new Promise((resolve, reject) => {
        if (user.length === 0) resolve(true)
        else reject({ msg: `User Exists with USN or Email`, id: user[0]._id, email: user[0].email, usn: user[0].usn })
    })
}

async function loginCheck(userId, password) {
    const user = await users.find({ $or: [{ email: userId }, { usn: userId }] })
    return new Promise((resolve, reject) => {
        if (user.length !== 0) {
            console.log(user)
            cryptPwd.decryptPwd(password, user[0].password)
                .then(res => {
                    console.log(res)
                    if (res) {
                        console.log('pass correct')
                        resolve({ usn: user[0].usn, email: user[0].email, name: user[0].name })
                    }
                    else {
                        console.log('Nopes-Wrong Pass');
                        reject('Wrong Password')
                    }
                })
        }
        else reject('User not registered. Please Register')
    })
}

async function userExistsResetPwd(q) {
    let user = await users.find({ $or: [{ email: q }, { usn: q }] })
    return new Promise((resolve, reject) => {
        if (user.length === 0) reject({ err: true, msg: `Can not find user with ${q}` })
        else resolve({ user })
    })
}

async function resetUserPassword(email, password) {
    const finalPassword = await cryptPwd.encryptPwd(password)
    return new Promise((resolve, reject) => {
        users.updateOne({ email: email }, {
            password: finalPassword
        })
            .then(msg => {
                console.log(msg)
                resolve(`Changed password for ${email}. Please login using new password`)
            })
            .catch(err => {
                console.log(err)
                reject(`Unable to update password. Please try again later.`)
            })
    })
}
module.exports = {
    createUser, userExists, loginCheck, userExistsResetPwd, resetUserPassword
}