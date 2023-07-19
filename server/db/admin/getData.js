const { users } = require('../userSchema')

exports.getTodayData = () => {
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    return new Promise((resolve, reject) => {
        users.find({
            'logsData.time': {
                $gte: currentDate,
                $lte: nextDate
            }
        }, { _id: 0, name: 1, lastLogin: 1, lastOut: 1 }).sort({ lastLogin: 1 })
            .then(results => {
                resolve(results)
            })
            .catch(err => {
                console.log(err)
                reject(`Error fetching data`)
            })
    })
}
exports.getDataByDate = (date) => {
    let currentDate = new Date()
    console.log(date)
    if (date.toLowerCase() === 'yesterday') currentDate.setDate(currentDate.getDate() - 1);

    currentDate.setHours(0, 0, 0, 0)
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    return new Promise((resolve, reject) => {
        users.aggregate([
            {
                $match: {
                    'logsData': {
                        $elemMatch: {
                            "time": {
                                $gte: currentDate,
                                $lte: nextDate
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    filteredLogs: {
                        $filter: {
                            input: "$logsData",
                            as: "log",
                            cond: {
                                $and: [
                                    { $gte: ["$$log.time", currentDate] },
                                    { $lte: ["$$log.time", nextDate] }
                                ]
                            }
                        }
                    }
                }
            }
        ])
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                console.log(err)
                reject(`Error fetching data`)
            })
    })

}
exports.getAllData = (userType) => {
    return new Promise((resolve, reject) => {
        users.aggregate([{
            $match:{
                role:'moderator'
            }
        },{

            $project: {
                name: 1,
                usn: 1,
                logsData: { time: 1 },
                

            }
        }])
            .then(results => {
                resolve(results)
            })
            .catch(err => {
                console.log(err)
                reject('Error fetching data')
            })
    })
}