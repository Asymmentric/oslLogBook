
const { storeMessage } = require('../db/chatFunc/chatRoom')
const { presence } = require('../server')
const { generateOTP } = require('../services/mailer')

const WebSocket = require('websocket').server
let allConnections = []



const ws = new WebSocket()

ws.mount({
    httpServer: presence,
    autoAcceptConnections: false
})

ws.on('request', (webSocketRequest) => {
    console.log('origin->', webSocketRequest.origin);

    let newUserId = getUserFromCookie(webSocketRequest.cookies)


    if (!newUserId) return webSocketRequest.reject()
    else {
        let chatId = generateOTP()
        webSocketRequest.on('requestAccepted', (webSocketConnection) => {
            console.log(`${newUserId} ${chatId} -> Connected and init`)

            //{pending}set status as online

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

        let reciever = JSON.parse(message.utf8Data)[1]['toUser']
        let msgToReciever = JSON.parse(message.utf8Data)[1]['value']
        let sender = JSON.parse(message.utf8Data)[1]['fromUser']
        allConnections.forEach(connection => {
            if (connection.chatId === sender) sender = connection.userUsn
        });

        let chatRoomId = JSON.parse(message.utf8Data)[1]['chatRoomId']

        sendMessageFromUserToUser(msgToReciever, reciever, sender, chatRoomId,new Date())

    })

    webSocketConnection.on('close', () => {
        
        allConnections = allConnections.filter(connection => {
            if (connection.wsConn.state === 'closed') {
                //{pending task} set status offline
                console.log(connection.userUsn, connection.chatId, ' OUT ')

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
function sendMessageFromUserToUser(message, reciever, sender, chatRoomId) {
    let sent = false
    allConnections.forEach(connection => {

        console.log(connection.userUsn, connection.chatId)

        if ((reciever === connection.userUsn || (reciever === connection.chatId))) {
            sent = true
            connection.wsConn.send(JSON.stringify(['chat', { fromUser: sender, value: message }]))
        }
    });
    storeMessage(message, reciever, sender, chatRoomId, sent)
}


module.exports = ws