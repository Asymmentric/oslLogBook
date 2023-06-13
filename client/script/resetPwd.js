const password1 = document.getElementById('password1')
const password2 = document.getElementById('password2')
const resetBtn = document.getElementsByTagName('button')
const errBox=document.getElementById('err-box')

resetBtn[0].addEventListener('click', (e) => {
    e.preventDefault()
    let pwd1 = password1.value
    let pwd2 = password2.value
    let url=window.location.href
    if (pwd1 === pwd2) {
        fetch('/updatepassword', {
            method: 'post',
            body: JSON.stringify({ pwd1, pwd2,url }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.err) {
                    errBox.style.padding = "10px"
                    errBox.innerText = data.msg
                    // window.location.href=data.redirect
                }
                if (!data.err) window.location.href = data.redirect
            })
    } else {
        errBox.style.padding = "10px"
        errBox.innerText = `Passwords do not match`
    }
})