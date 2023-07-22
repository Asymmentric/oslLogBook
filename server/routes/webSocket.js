const { getAllData } = require("../db/admin/getData");
const { getOrCreateChatRoom, fetchUserChatroomsFromDB, fetchAllMessagesFromChatRoom } = require("../db/chatFunc/chatRoom");
const { encryptPwd } = require("../util/pwdFunc");

exports.getActiveUsers = (req, res) => {
    let allUsersList = []
    let encryptedUsn = ''
    getAllData()
        .then(allUsers => {
            allUsers.forEach(user => {
                allUsersList.push({
                    nameOfUser: user.name,
                    usnOfUser: user.usn,
                    type: 'mods'
                })
            });
            res.send({ err: false, msg: allUsersList })
        })
        .catch(err => {
            console.log(err)
            res.send({ err: true, msg: 'Unable to fetch user list' })
        })
}

exports.getChatRoom = (req, res) => {
    const { reciever } = req.body
    const sender = req.session.userUsn
    console.log(req.body, sender)
    if (sender && reciever) {
        getOrCreateChatRoom(sender, reciever)
            .then(result => {
                // console.log(result)
                res.send({ err: false, chatRoomId: result.randomStringID })
            })
            .catch(err => {
                console.log(err)
                res.send({ err: true, msg: "unable to fetch" })
            })
    }
    else res.send({ err: true, msg: 'Reciever and sender not found' })
}

exports.fetchAllUserChatRoom = (req, res) => {

    const { userUsn } = req.session

    fetchUserChatroomsFromDB(userUsn)
        .then(chatRooms => {
            let chatRoomsList = []
            let toUser = ''
            let nameOfUser
            chatRooms.forEach(chatRoom => {
                console.log(1, chatRoom.participantInfo[0], 2, chatRoom.participantInfo[1])
                if (chatRoom.participantInfo[0] && chatRoom.participantInfo[1]) {
                    toUser = chatRoom.participantInfo[1].usn === userUsn ? chatRoom.participantInfo[0].usn : chatRoom.participantInfo[1].usn
                    nameOfUser = chatRoom.participantInfo[1].usn === userUsn ? chatRoom.participantInfo[0].name : chatRoom.participantInfo[1].name

                } else {
                    toUser = chatRoom.participantInfo[0].usn
                    nameOfUser = chatRoom.participantInfo[0].name
                }

                chatRoomsList.push({
                    chatRoomId: chatRoom.randomStringID,
                    usnOfUser: toUser,
                    nameOfUser
                })
            });
            res.send({ err: false, chatRooms, chatRooms: chatRoomsList })
        })
        .catch(err => {
            console.log(err)
            res.send({ err: true, msg: 'Unable to fetch chatrooms' })
        })
}

exports.fetchAllUserMessages = (req, res) => {
    const { chatRoomId } = req.body
    if (chatRoomId) {
        fetchAllMessagesFromChatRoom(chatRoomId)
            .then(allMessages => {
                // console.log('---',allMessages)
                res.send({ err: false, msg: allMessages })
            })
            .catch(err => {
                res.send({ err: true, msg: "Cant get messages" })
            })
    }
}