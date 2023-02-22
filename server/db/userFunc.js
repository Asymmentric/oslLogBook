const {users}=require('./userSchema')
const cryptPwd=require('../util/pwdFunc')

async function createUser(usn, name, email, password) {
    const finalPassword=await cryptPwd.encryptPwd(password)
    return new Promise((resolve, reject) => {
        const user=new users({
            usn:usn.toLowerCase(),
            name:name.toLowerCase(),
            email:email.toLowerCase(),
            password:finalPassword
        })

        user.save()
            .then((msg)=>{
                console.log(msg)
                resolve(`Added ${name} - USN:${usn}`)
            })
            .catch((err)=>{
                console.log(err)
                reject(`Couldn't Register. Try Again`)
            })
    })
}

async function userExists(usn,email) {
    let user=await users.find({$or:[{email:email},{usn:usn}]})

    return new Promise((resolve, reject) => {
        if(user.length===0) resolve(true)
        else reject({msg:'User Exists', id:user[0]._id,email:user[0].email,usn:user[0].usn})
    })
}

async function loginCheck(userId,password) {
    const user=await users.find({$or:[{email:userId},{usn:userId}]})
    return new Promise((resolve, reject) => {
        if(user.length!==0){
            console.log(user)
            cryptPwd.decryptPwd(password,user[0].password)
            .then(res=>{
                console.log(res)
                if(res){
                    console.log('pass correct')
                    resolve({usn:user[0].usn,email:user[0].email,name:user[0].name})
                }
                else{
                    console.log('Nopes-Wrong Pass');
                    reject('Wrong Password')
                }
            })
        }
        else reject('User not registered. Please Register')
    })
}

async function scanLog(usn,ip,useragent) {
    console.log(usn,ip,useragent)
    return new Promise((resolve, reject) => {
        users.findOneAndUpdate(
            {usn:usn.toLowerCase()},
            {$push:{
                logsData:[{
                    usersagent:useragent,ip:ip
            }]
            }}
        )
        .then((msg)=>{
            console.log('0',msg)
            resolve({code:200,msg:'Logged Successfully'})
        })
        .catch((err)=>{
            console.log('----ERROR----\n',err)
            reject({code:500,msg:'Unable to Log'})
        })
    })
}

module.exports={
    createUser, userExists, loginCheck,scanLog
}