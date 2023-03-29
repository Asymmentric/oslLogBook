const ip = document.getElementsByTagName('input')
const errs=document.getElementById('err-msg')


ip[2].addEventListener('click', (e) => {
    e.preventDefault()
    let userId = ip[0].value
    let password = ip[1].value
    if(userId!='' && password!=''){
        fetch('/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,password
            })
        })
            .then(response => response.json())
            .then(data=>{
                console.log(data)
                if (data.err === true ) {
                    errs.innerText = data.msg
                }
                else {
                    location.reload()
                }
            })
    }
    else{
        errs.innerText='All fields are mandatory'
    }
    
})