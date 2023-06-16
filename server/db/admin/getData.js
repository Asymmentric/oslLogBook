const { users } = require('../userSchema')

exports.getTodayData = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    return new Promise((resolve, reject) => {
        users.find({
            'logsData.time':{
                $gte:currentDate,
                $lte:nextDate
            }
        }, { _id: 0, name: 1, "logsData.time": 1,lastLogin:1 }).sort({'logsData':1})
            .then(results => {
                resolve(results)
            })
            .catch(err => {
                console.log(err)
                reject(`Error fetching data`)
            })
    })
}

exports.getAllData=()=>{
    return new Promise((resolve, reject) => {
        users.find({},{name:1,'logsData:time':1})
        .then(results=>{
            resolve(results)
        })
        .catch(err=>{
            console.log(err)
            reject('Error fetching data')
        })
    })
}