const { presence } = require('../server')
const { generateOTP } = require('../services/mailer')

const WebSocket = require('websocket').server
let allConnections=[]


const ws = new WebSocket()

ws.mount({
    httpServer: presence,
    autoAcceptConnections: false
})

ws.on('request', (webSocketRequest) => {
    console.log('origin->', webSocketRequest.origin);

    let newUserId=getUserFromCookie(webSocketRequest.cookies)

    if(!newUserId) return webSocketRequest.reject()
    else{
        allConnections.push({
            userUsn:getUserFromCookie(webSocketRequest.cookies),
            wsConn:webSocketRequest.accept(),
            chatId:generateOTP()
        })
    }
    


})

ws.on('connect', (webSocketConnection) => {
    // console.log(webSocketConnection)

    webSocketConnection.send(JSON.stringify({ Status: 'OK', connected: true, id: 1, msg: 'Hey' }))

    webSocketConnection.on('message', (message) => {
        console.log(message)
        let reciever=JSON.parse(message.utf8Data)[1]['toUser']
        let msgToReciever=JSON.parse(message.utf8Data)[1]['value']
        
        sendMessageFromUserToUser(msgToReciever,reciever)

    })
    webSocketConnection.on('close',()=>{
        allConnections.forEach(connection=>{
            if(connection.wsConn.state==='closed') {
                console.log(connection.userUsn,' OUT ')
                allConnections.pop()
            }
        })
    })
})
function getUserFromCookie(cookies) {
    let userUsn=false
    cookies.forEach(cookie => {
        if(cookie.name==='oslLogUser') userUsn=JSON.parse(cookie.value)['usn']
    });
    return userUsn
    
}
function sendMessageFromUserToUser(message,reciever) {
    allConnections.forEach(connection => {
        console.log(connection.userUsn,connection.chatId)
        if(reciever===connection.userUsn){
            connection.wsConn.send(JSON.stringify(['chat',{fromUser:'',value:message}]))
        }
    });
}

module.exports = ws