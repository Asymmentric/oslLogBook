const { users } = require('../userSchema')

exports.getTodayData = () => {
    let currentDate=new Date()
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    return new Promise((resolve, reject) => {
        users.find({
            'logsData.time':{
                $gte:currentDate,
                $lte:nextDate
            }
        }, { _id: 0, name: 1, "logsData.time": 1,'logsData.outTime':1, lastLogin:1,lastOut:1 }).sort({lastLogin:1})
            .then(results => {
                resolve(results)
            })
            .catch(err => {
                console.log(err)
                reject(`Error fetching data`)
            })
    })
}
exports.getDataByDate=(date)=>{
    let currentDate=new Date(date)
    currentDate.setHours(0,0,0,0)
    const nextDate=new Date(currentDate);
    nextDate.setDate(currentDate.getDate()+1);

}
exports.getAllData=()=>{
    return new Promise((resolve, reject) => {
        users.aggregate([{
            $project:{
                name:1,
                logsData:{time:1}
            }
        }])
        .then(results=>{
            resolve(results)
        })
        .catch(err=>{
            console.log(err)
            reject('Error fetching data')
        })
    })
}