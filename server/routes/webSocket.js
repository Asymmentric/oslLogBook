const { getAllData } = require("../db/admin/getData");
const { encryptPwd } = require("../util/pwdFunc");

exports.getActiveUsers=(req,res)=>{
    let allUsersList=[]
    let encryptedUsn=''
    getAllData()
    .then(allUsers=>{
        allUsers.forEach(user => {
            allUsersList.push({
                nameOfUser:user.name,
                usnOfUser:user.usn
            })
        });
        res.send({err:false,msg:allUsersList})
    })
    .catch(err=>{
        console.log(err)
        res.send({err:true,msg:'Unable to fetch user list'})
    })
}