const ip = document.getElementsByTagName('input')
<<<<<<< HEAD
const errs = document.getElementById('err-msg')


ip[4].addEventListener('click', (e) => {
    e.preventDefault()
    let usn = ip[0].value
    let email = ip[1].value
    let name = ip[2].value
    let password = ip[3].value
    if (name != '' && password != '' && usn != '' && email != '') {
        fetch('/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usn, email, name, password
            })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.err === true) {
                    errs.innerText = data.msg
                }
                else {
                    location.reload()
                }

            })
    }
    else {
        errs.innerText = 'All fields are mandatory'
    }
})
=======
const container = document.getElementsByClassName('container')
let verif = ''
let otpIp = ''

let errBox = document.getElementById('err-box');

ip[4].addEventListener('click', (e) => {
    e.preventDefault()
    errBox.innerText=""
    let usn = ip[0].value
    let email = ip[1].value
    let userName = ip[2].value
    let password = ip[3].value

    fetch('/auth/route/type/otp/send', {

        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usn, name: userName, email, password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.err) errBox.innerText = data.msg
            if (!data.err) {

                container[0].innerHTML = ''
                container[0].innerHTML = `
                <p id="err-box"></p>
        <div class="box">
            <div class="right">
                <p>OTP sent to ${email}
            </div>
        </div>
        <div class="box">
            <div class="right">
                <input type="number" name="text" placeholder="OTP" id="otp">
            </div>
        </div>
        <div class="box">
            <div class="regBtn">
                <input type="button" value="Verify" id="verif">
            </div>
        </div>`
                errBox = document.getElementById('err-box');
                verif = document.getElementById('verif')
                otpIp = document.getElementById('otp')

                verif.addEventListener('click', (e) => {
                    e.preventDefault()
                    otp = otpIp.value
                    fetch('/auth/route/type/otp/verify', {
                        redirect: 'follow',
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ otp })
                    })
                        .then(response1 => response1.json())
                        .then(data => {
                            if (data.err) errBox.innerText = data.msg
                            if (data.err === false) {
                                return fetch('/register', {
                                    method: 'post',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        usn, name: userName, email, password
                                    })
                                })
                            }

                        })
                        .then(async response2 => response2.json())
                        .then(data => {
                            if (!data.err) window.location.href = data.redirect
                            if (data.err) { console.log('err'); errBox.innerText = data.msg }
                        })
                        .catch(err => err)

                })

            }
        })
        .catch(err => {
            console.log("Some error occured");
        })


})



>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
