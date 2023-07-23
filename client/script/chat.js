const chatConnectBtn = document.getElementsByClassName('chat-btn')
const msgIp = document.getElementById('message-input')
const msgSendBtn = document.getElementById('msg-send-btn')
const userBox = document.querySelector('#users-list')
const chatContainer = document.getElementById('chat-cont')
const prevMsgContainer = document.getElementsByClassName('prev-msg')
const eachUser = document.getElementsByClassName('user-burb')
const userNameDiv = document.getElementById('name-of-user')

chatConnectBtn[0].addEventListener('click', initConn)

let toUser = null       // toUser is the message reciever
let fromUser = null     //fromUser is the current user
let chatRoomId = null
let allUsers = []

function initConn() {
    userBox.innerHTML = ''
    getAllActiveUsers()

    chatContainer.style.display = 'flex'

    let websocket = createWebSocketConnection()

    msgIp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') msgSendBtn.click()
        else {
            // console.log(e.key)
            sendMessage(websocket, 'typing')
        }
    })

    window.addEventListener('beforeunload', () => {
        websocket.close()
    })

    websocket.addEventListener('message', (msg) => {

        let msgValue = JSON.parse(msg.data)
        // console.log(msgValue)

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
                    userBox.prepend(document.getElementById(msgValue[1].fromUser))
                    scrollToBottom(prevMsgContainer[0])
                }
                else {
                    document.getElementById(msgValue[1].fromUser).style.backgroundColor = '#8fb0e6'
                    document.getElementById(msgValue[1].fromUser).style.fontWeight = 'bolder'
                    userBox.prepend(document.getElementById(msgValue[1].fromUser))
                }
                break;

            case 'typing':
                if (!document.getElementById(`${toUser}-typing`)) {

                    if (msgValue[1].fromUser === toUser) {
                        let newMsgElem = document.createElement('div')
                        newMsgElem.id = `${toUser}-typing`
                        newMsgElem.setAttribute('class', 'type-activity')
                        newMsgElem.innerText = 'Typing...'

                        prevMsgContainer[0].append(newMsgElem)
                        // userBox.prepend(document.getElementById(msgValue[1].fromUser))
                        scrollToBottom(prevMsgContainer[0])
                        setTimeout(() => {
                            document.getElementById(`${toUser}-typing`).remove()
                        }, 1000);

                    }
                    else {

                        if (!document.getElementById(`${fromUser}-type`)) {
                            let newTypeElem = document.createElement('p')
                            newTypeElem.id = `${fromUser}-type`
                            newTypeElem.setAttribute('class', 'type-activity')
                            newTypeElem.style.color = 'green'
                            newTypeElem.innerText = 'Typing...'
                            document.getElementById(msgValue[1].fromUser).append(newTypeElem)
                            setTimeout(() => {
                                newTypeElem.remove()
                            }, 1000);
                        }

                    }
                }

                break;

            case 'status':
                // console.log(`${msgValue[1].fromUser}-active-status`)
                // console.log(`active-status ${msgValue[1].message ? 'online' : 'offline'}`)
                setTimeout(() => {
                    
                    document.getElementById(`${msgValue[1].fromUser}-activity-status`).setAttribute('class', `active-status ${msgValue[1].value ? 'online' : 'offline'}`)
                }, 2000);
                break;
            default:
                break;
        }

    })

    msgSendBtn.addEventListener('click', (e) => {
        e.preventDefault()
        sendMessage(websocket, 'chat');
    })


}

function createWebSocketConnection() {
    if (fromUser) websocket.close()
    return new WebSocket("wss://logbookosl.azurewebsites.net")

    // return new WebSocket('ws://localhost:9090')
}

function sendMessage(websocket, typeOfMsg) {
    switch (typeOfMsg.toLowerCase()) {
        case 'chat':
            if ((toUser !== null) && (msgIp.value.trim() !== '')) {

                websocket.send(JSON.stringify([typeOfMsg, { fromUser, toUser, chatRoomId, value: msgIp.value, msgTimestamp: new Date() }]))
                userBox.prepend(document.getElementById(toUser))
                let newMsgElem = document.createElement('div')
                newMsgElem.setAttribute('class', 'sent-msg')
                newMsgElem.innerText = msgIp.value

                msgIp.value.trim() !== '' ? prevMsgContainer[0].append(newMsgElem) : 1
                scrollToBottom(prevMsgContainer[0])
                msgIp.value = ''
            }
            else console.log('No user')
            break;
        case 'typing':
            if ((toUser !== null)) {

                websocket.send(JSON.stringify([typeOfMsg, { fromUser, toUser, chatRoomId, value: '' }]))

            }
            else console.log('No user')

        default:
            break;
    }

}

function prepareToUser(e) {
    msgIp.value = ''
    toUser = e.id;
    // console.log(e.innerText)
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
            // console.log(data.chatRoomId)
            chatRoomId = data.chatRoomId
            return getAllUserMessages(chatRoomId, 0)
        })

    for (let i = 0; i < eachUser.length; i++) {
        const element = eachUser[i];
        element.style.color = 'white'

    }
    e.style.backgroundColor = 'transparent'
    e.style.fontWeight = 'normal'
    e.style.color = 'red'
    // console.log(toUser)
    prevMsgContainer[0].innerHTML = ''
    msgIp.focus()


}

function populateUserBox(user) {

    let userUI = document.createElement('div')
    userUI.className = 'user-burb'
    userUI.id = user.usnOfUser
    userUI.setAttribute('onclick', 'prepareToUser(this)')
    userUI.innerHTML = `
    <div class="userUI-name-container">
        <div class="userUI-container">
            <div>
                <p class="user-name mod">${user.nameOfUser}</p>
            </div>
        </div>
        <div>
                <p id="${user.usnOfUser}-activity-status" class="active-status ${user.userActiveStatus ? 'online' : 'offline'}"></p>
        </div>
    </div>
    `


    userBox.append(userUI)




}

function getAllActiveUsers() {
    fetch('list/users/mods')
        .then(response => response.json())
        .then(data => {
            // console.log(data.msg)
            data.msg.forEach(user => {
                populateUserBox(user)
            });
            allUsers = data.msg
            // console.log(data.msg)
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
                // console.log(chatRoom.usnOfUser)
                if (!isUsnAlreadyPresent(chatRoom.usnOfUser)) {
                    populateUserBox(chatRoom)
                    allUsers.push(chatRoom)
                }

            });
            // console.log(12312321, allUsers)
            // populateUserBox(allUsers)
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

function scrollToTop(elem) {
    elem.scrollTop = 0
}

function createNewUserBoxDiv(divId, chatIdUser) {
    let newUserUI = document.createElement('div')
    newUserUI.setAttribute('class', 'user-burb')
    newUserUI.setAttribute('id', divId)
    newUserUI.setAttribute('onclick', 'prepareToUser(this)')
    newUserUI.innerHTML = `<p class="user-name">${divId}</p>`
    userBox.append(newUserUI)

}

function getAllUserMessages(chatRoomId, i) {
    fetch('/users/chatrooms/allmessages', {
        method: 'post',
        body: JSON.stringify({ chatRoomId, i }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            if (data.msg.length !== 0) {
                data.msg.forEach(message => {
                    if (message.msgFrom === fromUser) {
                        // console.log(message.msgTo, toUser)
                        let newMsgElem = document.createElement('div')
                        newMsgElem.setAttribute('class', 'sent-msg')
                        newMsgElem.innerText = message.msgBody

                        prevMsgContainer[0].prepend(newMsgElem)
                        // if (message.visited === true) scrollToBottom(prevMsgContainer[0])

                    } else {
                        let newMsgElem = document.createElement('div')
                        newMsgElem.setAttribute('class', 'rec-msg')
                        newMsgElem.innerText = message.msgBody

                        prevMsgContainer[0].prepend(newMsgElem)
                        // if (message.visited === true) scrollToBottom(prevMsgContainer[0])
                    }


                });

                getMoreMessages(chatRoomId, i + 1)
            }

        })
}

function getMoreMessages(chatRoomId, i) {

    let moreMessageElement = document.createElement('p')
    moreMessageElement.id = 'get-more-msg-elem'
    moreMessageElement.innerText = 'Load More'
    moreMessageElement.onclick = () => {

        document.getElementById('get-more-msg-elem').remove()   //removes Load More <p> tag

        getAllUserMessages(chatRoomId, i)
    }
    prevMsgContainer[0].prepend(moreMessageElement)
    // console.log(i)
    i > 1 ? scrollToTop(prevMsgContainer[0]) : scrollToBottom(prevMsgContainer[0]) //scroll to top at i=0 becoz we're using prepend, which means last element 

}

