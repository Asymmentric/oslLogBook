const chatConnectBtn = document.getElementsByClassName('chat-btn')
const msgIp = document.getElementById('message-input')
const msgSendBtn = document.getElementById('msg-send-btn')
const userBox = document.querySelector('#users-list')
const chatContainer = document.getElementById('chat-cont')
const prevMsgContainer = document.getElementsByClassName('prev-msg')
const eachUser = document.getElementsByClassName('user-burb')
const userNameDiv = document.getElementById('name-of-user')

chatConnectBtn[0].addEventListener('click', initConn)
let toUser = null
let fromUser = null
let chatRoomId = null
let allUsers = []

function initConn() {

    getAllActiveUsers()

    chatContainer.style.display = 'flex'

    let websocket = createWebSocketConnection()

    window.addEventListener('beforeunload',()=>{
        websocket.close()
    })

    websocket.addEventListener('message', (msg) => {

        let msgValue = JSON.parse(msg.data)
        console.log(msgValue)

        switch (msgValue[0]) {
            case 'init':
                fromUser = msgValue[1].sender
                break;

            case 'chat':
                //if to User in all user->good, take that ele
                if (msgValue[1].fromUser === toUser) {
                    let newMsgElem = document.createElement('div')
                    newMsgElem.setAttribute('class', 'rec-msg')
                    newMsgElem.innerText = msgValue[1].value

                    prevMsgContainer[0].append(newMsgElem)
                    scrollToBottom(prevMsgContainer[0])
                }
                else{
                    document.getElementById(msgValue[1].fromUser).style.backgroundColor='#8fb0e6'
                    document.getElementById(msgValue[1].fromUser).style.fontWeight='bolder'
                }

                break;

            default:
                break;
        }

    })

    msgSendBtn.addEventListener('click', (e) => {
        sendMessage(websocket);

    })


}

function createWebSocketConnection() {
    // return new WebSocket("wss://logbookosl.azurewebsites.net")
    return new WebSocket('ws://localhost:9090')
}

function sendMessage(websocket) {

    ((toUser !== null) && (msgIp.value.trim() !== '')) ? websocket.send(JSON.stringify(['chat', { fromUser, toUser, chatRoomId, value: msgIp.value }])) : console.log('No user')

    let newMsgElem = document.createElement('div')
    newMsgElem.setAttribute('class', 'sent-msg')
    newMsgElem.innerText = msgIp.value

    msgIp.value.trim() !== '' ? prevMsgContainer[0].append(newMsgElem) : 1
    scrollToBottom(prevMsgContainer[0])
    msgIp.value = ''

}
function prepareToUser(e) {

    toUser = e.id;
    console.log(e.innerText)
    let userNaam = e.innerText
    userNameDiv.innerText = userNaam

    //get chat room
    fetch('/get/chatroom', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reciever: toUser })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.chatRoomId)
            chatRoomId = data.chatRoomId
            return getAllUserMessages(chatRoomId)
        })

    for (let i = 0; i < eachUser.length; i++) {
        const element = eachUser[i];
        element.style.color = 'white'

    }
    e.style.backgroundColor='transparent'
    e.style.fontWeight='normal'
    e.style.color = 'red'
    console.log(toUser)
    prevMsgContainer[0].innerHTML = ''
    userNameDiv[0].innerHTML = ``
}

function populateUserBox(users) {

    users.forEach(user => {
        let userUI = document.createElement('div')
        userUI.className = 'user-burb'
        userUI.id = user.usnOfUser
        userUI.setAttribute('onclick', 'prepareToUser(this)')
        userUI.innerHTML = `<p class="user-name mod">${user.nameOfUser}</p>`
        userBox.append(userUI)
    });

}

function getAllActiveUsers() {
    fetch('list/users/mods')
        .then(response => response.json())
        .then(data => {
            // console.log(data.msg)
            allUsers = data.msg
            return getAllChatsForUser()
        })
        .catch(err => {
            return null
        })
}

function getAllChatsForUser() {
    fetch('/users/chatrooms', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.chatRooms.forEach(chatRoom => {
                console.log(chatRoom.usnOfUser)
                if (!isUsnAlreadyPresent(chatRoom.usnOfUser)) allUsers.push(chatRoom)

            });
            console.log(12312321, allUsers)
            populateUserBox(allUsers)
        })
}

function isUsnAlreadyPresent(usn) {
    for (let index = 0; index < allUsers.length; index++) {
        const element = allUsers[index];
        if (element.usnOfUser === usn) return true
    }
}

function scrollToBottom(elem) {
    elem.scrollTop = elem.scrollHeight
}

function createNewUserBoxDiv(divId, chatIdUser) {
    let newUserUI = document.createElement('div')
    newUserUI.setAttribute('class', 'user-burb')
    newUserUI.setAttribute('id', divId)
    newUserUI.setAttribute('onclick', 'prepareToUser(this)')
    newUserUI.innerHTML = `<p class="user-name">${divId}</p>`
    userBox.append(newUserUI)

}

function getAllUserMessages(chatRoomId) {
    fetch('/users/chatrooms/allmessages', {
        method: 'post',
        body: JSON.stringify({ chatRoomId }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            data.msg.forEach(message => {
                if (message.msgFrom === fromUser) {
                    console.log(message.msgTo, toUser)
                    let newMsgElem = document.createElement('div')
                    newMsgElem.setAttribute('class', 'sent-msg')
                    newMsgElem.innerText = message.msgBody

                    prevMsgContainer[0].append(newMsgElem)
                    if(message.visited===true) scrollToBottom(prevMsgContainer[0])
                } else {
                    let newMsgElem = document.createElement('div')
                    newMsgElem.setAttribute('class', 'rec-msg')
                    newMsgElem.innerText = message.msgBody

                    prevMsgContainer[0].append(newMsgElem)
                    if(message.visited===true) scrollToBottom(prevMsgContainer[0])
                }


            });
        })
}

