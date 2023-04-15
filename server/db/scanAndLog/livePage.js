const {users}=require('../userSchema')

exports.getLastLogin=async (userId)=>{
    return new Promise((resolve, reject) => {
        users.findOne({ $or: [{ email: userId }, { usn: userId }] },{lastLogin:1,usn:1,name:1})
        .then(userData=>{
            
            resolve(userData)
        })
        .catch(err=>{
            reject({err:true,msg:`Couldn't get last login details`})
        })
    })

}