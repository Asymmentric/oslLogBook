const chatConnectBtn = document.getElementsByClassName('chat-btn')
const msgIp = document.getElementById('message-input')
const msgSendBtn = document.getElementById('msg-send-btn')
const userBox = document.querySelector('#users-list')
const chatContainer = document.getElementById('chat-cont')
const prevMsgContainer=document.getElementsByClassName('prev-msg')
const eachUser=document.getElementsByClassName('user-burb')

chatConnectBtn[0].addEventListener('click', initConn)
let toUser = null

function initConn() {
    getAllActiveUsers()

    let websocket = createWebSocketConnection()

    chatContainer.style.display = 'flex'

    msgSendBtn.addEventListener('click', (e) => {
        sendMessage(websocket);
    })

    websocket.addEventListener('message', (msg) => {
        let msgValue=JSON.parse(msg.data)[1].value

        console.log(msgValue[1].value)
        let newMsgElem=document.createElement('div')
        newMsgElem.setAttribute('class','rec-msg')
        newMsgElem.innerText=msgValue
        
        prevMsgContainer[0].append(newMsgElem)
    })
}

function createWebSocketConnection() {
    return new WebSocket("wss://logbookosl.azurewebsites.net")
}

function sendMessage(websocket) {
    toUser !== null ? websocket.send(JSON.stringify(['chat', { toUser, value: msgIp.value }])) : console.log('No user')
}
function prepareToUser(e) {

    toUser = e.id;
    
    for (let i = 0; i < eachUser.length; i++) {
        const element = eachUser[i];
        element.style.color='white'
        
    }
    e.style.color='red'
    console.log(toUser)
}
function getAllActiveUsers() {
    fetch('list/active/users')
        .then(response => response.json())
        .then(data => {
            let usersUI = ''
            console.log(data)
            data.msg.forEach(user => {
                usersUI += `<div class="user-burb" id="${user.usnOfUser}" onclick="prepareToUser(this)">
        <p class="user-name">${user.nameOfUser}</p>
    </div>`
            });

            userBox.innerHTML = usersUI

        })
}

