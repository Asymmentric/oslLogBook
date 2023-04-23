const { users } = require('../userSchema')

exports.getLastLogin = async (userId) => {
    return new Promise((resolve, reject) => {
        users.findOne({ $or: [{ email: userId }, { usn: userId }] })
            .then(userData => {
                console.log(userData)
                userData.lastLogin ? resolve({ userData }) : resolve({ userData, newUser: true })
            })
            .catch(err => {
                console.log(err)
                reject({ err: true, msg: `Couldn't get last login details` })
            })
    })

}