
const { storeMessage, setUserActivityStatus, fetchUserChatroomsFromDB } = require('../db/chatFunc/chatRoom')
const { presence } = require('../server')
const { generateOTP } = require('../services/mailer')

const WebSocket = require('websocket').server
let allConnections = []



const ws = new WebSocket()

ws.mount({
    httpServer: presence,
    autoAcceptConnections: false
})

ws.on('request', async (webSocketRequest) => {
    console.log('origin->', webSocketRequest.origin);

    let newUserId = getUserFromCookie(webSocketRequest.cookies)


    if (!newUserId) return webSocketRequest.reject()
    else {
        let chatId = generateOTP()
        webSocketRequest.on('requestAccepted', async (webSocketConnection) => {
            console.log(`${newUserId} ${chatId} -> Connected and init`)

            //{pending}set status as online    
            // let actii=await setUserActivityStatus(newUserId,true)
            // console.log(actii)
            webSocketConnection.send(JSON.stringify(['init', { sender: newUserId, connected: true, id: 1, msg: 'Hey' }]))

        })
        let connDetails = {
            userUsn: newUserId,
            wsConn: webSocketRequest.accept(),
            chatId
        }

        allConnections.push(connDetails)

        allConnections.forEach(connection => {

            console.log('req->', connection.userUsn, connection.chatId)
        });
        notifyActivityStatus(newUserId, true)

        await setUserActivityStatus(newUserId,true)

    }
})

ws.on('connect', (webSocketConnection) => {
    // console.log(webSocketConnection)

    webSocketConnection.on('message', (message) => {
        console.log(message)
        let parsedMessage = messageParser(message)
        if (parsedMessage) {
            let reciever = parsedMessage.reciever
            let msgToReciever = parsedMessage.msgToReciever
            let sender = parsedMessage.sender
            allConnections.forEach(connection => {
                if (connection.chatId === sender) sender = connection.userUsn
            });

            let chatRoomId = parsedMessage.chatRoomId
            let typeOfMsg = parsedMessage.typeOfMsg


            sendMessageFromUserToUser(typeOfMsg, msgToReciever, reciever, sender, chatRoomId, new Date())
        }


    })

    webSocketConnection.on('close', async () => {
        let outUser=''
        allConnections = allConnections.filter(connection => {
            if (connection.wsConn.state === 'closed') {
                console.log(connection.userUsn, connection.chatId, ' OUT ')
                outUser=connection.userUsn

            }
            return connection.wsConn.state !== 'closed'
        })

        notifyActivityStatus(outUser, false)

        await setUserActivityStatus(outUser,false)
    })

})


function getUserFromCookie(cookies) {
    let userUsn = false
    cookies.forEach(cookie => {
        if (cookie.name === 'oslLogUser') userUsn = JSON.parse(cookie.value)['usn']
    });
    return userUsn

}

function sendMessageFromUserToUser(typeOfMsg, message, reciever, sender, chatRoomId) {
    switch (typeOfMsg.toLowerCase()) {
        case 'chat':
            let sent = false
            allConnections.forEach(connection => {

                console.log(connection.userUsn, connection.chatId)

                if ((reciever === connection.userUsn) || (reciever === connection.chatId)) {
                    sent = true
                    connection.wsConn.send(JSON.stringify(['chat', { fromUser: sender, value: message }]))
                }
            });
            storeMessage(message, reciever, sender, chatRoomId, sent)
            break;
        case 'typing':
            allConnections.forEach(connection => {

                // console.log(connection.userUsn, connection.chatId)

                if ((reciever === connection.userUsn) || (reciever === connection.chatId)) {

                    connection.wsConn.send(JSON.stringify(['typing', { fromUser: sender, value: true }]))
                }
            });
            break;
        case 'status':
            allConnections.forEach(connection => {
                // console.log(connection.userUsn,reciever, message, sender)
                if ((reciever === connection.userUsn) || (reciever === connection.chatId)) {
                    connection.wsConn.send(JSON.stringify(['status', { fromUser: sender, value: message }]))
                    // console.log(10000,sender,true,'at=>',reciever, connection.userUsn)
                }
            })

        default:
            break;
    }

}

function messageParser(incomingMessage) {
    try {
        let reciever = JSON.parse(incomingMessage.utf8Data)[1]['toUser']
        let msgToReciever = JSON.parse(incomingMessage.utf8Data)[1]['value']
        let sender = JSON.parse(incomingMessage.utf8Data)[1]['fromUser']
        let chatRoomId = JSON.parse(incomingMessage.utf8Data)[1]['chatRoomId']
        let typeOfMsg = JSON.parse(incomingMessage.utf8Data)[0]

        return { typeOfMsg, reciever, msgToReciever, sender, chatRoomId }

    } catch (err) {
        console.log(err)
        return false
    }
}

function notifyActivityStatus(userUsn, status) {

    fetchUserChatroomsFromDB(userUsn)
        .then(chatRooms => {
            let chatRoomsList = []
            let toUser = ''
            let nameOfUser = ''
            let toUserActivityStatus = ''
            chatRooms.forEach(chatRoom => {

                // console.log(1, chatRoom.participantInfo[0], 2, chatRoom.participantInfo[1])

                if (chatRoom.participantInfo[0] && chatRoom.participantInfo[1]) {
                    toUser = chatRoom.participantInfo[1].usn === userUsn ? chatRoom.participantInfo[0].usn : chatRoom.participantInfo[1].usn
                    nameOfUser = chatRoom.participantInfo[1].usn === userUsn ? chatRoom.participantInfo[0].name : chatRoom.participantInfo[1].name
                    toUserActivityStatus = chatRoom.participantInfo[1].usn === userUsn ? chatRoom.participantInfo[0].activityStatus : chatRoom.participantInfo[1].activityStatus

                } else {
                    toUser = chatRoom.participantInfo[0].usn
                    nameOfUser = chatRoom.participantInfo[0].name
                }
                // console.log(chatRoom.randomStringID, toUser, nameOfUser, userUsn)
                chatRoomsList.push({
                    reciever:toUser,
                    sender:userUsn
                })

            });

            chatRoomsList.forEach(chatUser => {
                sendMessageFromUserToUser('status',status,chatUser.reciever,chatUser.sender)
            });
            

        })
        .catch(err => {
            console.log(err)
        })
}
module.exports = ws