
const { storeMessage, setUserActivityStatus } = require('../db/chatFunc/chatRoom')
const { presence } = require('../server')
const { generateOTP } = require('../services/mailer')

const WebSocket = require('websocket').server
let allConnections = []



const ws = new WebSocket()

ws.mount({
    httpServer: presence,
    autoAcceptConnections: false
})

ws.on('request',  (webSocketRequest) => {
    console.log('origin->', webSocketRequest.origin);

    let newUserId = getUserFromCookie(webSocketRequest.cookies)


    if (!newUserId) return webSocketRequest.reject()
    else {
        let chatId = generateOTP()
        webSocketRequest.on('requestAccepted',async(webSocketConnection) => {
            console.log(`${newUserId} ${chatId} -> Connected and init`)

            //{pending}set status as online    
            let actii=await setUserActivityStatus(newUserId,true)
            console.log(actii)
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

    webSocketConnection.on('close', () => {

        allConnections = allConnections.filter(async connection => {
            if (connection.wsConn.state === 'closed') {
                //{pending task} set status offline
                let stss=await setUserActivityStatus(connection.userUsn,false)
                console.log(stss,connection.userUsn, connection.chatId, ' OUT ')
                
            }
            return connection.wsConn.state !== 'closed'
        })
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

                if ((reciever === connection.userUsn || (reciever === connection.chatId))) {
                    sent = true
                    connection.wsConn.send(JSON.stringify(['chat', { fromUser: sender, value: message }]))
                }
            });
            storeMessage(message, reciever, sender, chatRoomId, sent)
            break;
        case 'typing':
            allConnections.forEach(connection => {

                // console.log(connection.userUsn, connection.chatId)

                if ((reciever === connection.userUsn || (reciever === connection.chatId))) {

                    connection.wsConn.send(JSON.stringify(['typing', { fromUser: sender, value: true }]))
                }
            });
            break;

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
module.exports = ws