const ip = document.getElementsByTagName('input')
const btn = document.getElementsByTagName('button')
let errBox = document.getElementById('err-box')
let forgotPwd = document.getElementById('forgot-pwd')
let container = document.getElementsByClassName('login-form-container')

forgotPwd.addEventListener('click', (e) => {
    container[0].innerHTML = ''
    container[0].innerHTML = `
    <div id="err-box"></div>
            
                <h1>Forgot Password</h1>
                <div class="form-field">
                    <label for="userId">USN / Email</label>
                    <input type="text" name="q" id="q" placeholder="username or email" required>
                </div>
                <div class="form-field">
                    <button type="submit" id="reset-btn">Reset</button>
                </div>
            
    `
    let resetBtn = document.getElementById('reset-btn')
    let resetField = document.getElementById('q')
    let errBox = document.getElementById('err-box')
    resetField.value = ''

    resetBtn.addEventListener('click', (e) => {
        let q = resetField.value
        console.log(q.length)
        if (q.length===0) {
            errBox.style.padding = "10px"
            errBox.innerText = `Enter email or USN`
        }
        else {
            fetch('/auth/route/type/password/forgot', {
                method: 'post',
                body: JSON.stringify({ q }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if(data.err){
                        errBox.style.padding="10px"
                        errBox.innerText=data.msg
                    }
                    else{
                        container[0].innerHTML = `
                        <p>${data.msg}</p>
                        `
                    }
                })
        }
    })
})



btn[0].addEventListener('click', (e) => {
    e.preventDefault();
    errBox.innerText = ""
    errBox.style.padding = 0;
    let userId = ip[0].value
    let password = ip[1].value
    fetch('/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.err) {
                errBox.style.padding = "10px"
                errBox.innerText = data.msg
            }
            if (!data.err) window.location.href = data.redirect
        })
        .catch(err => {
            console.log(err)
        })
})