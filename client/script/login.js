const ip=document.getElementsByTagName('input')
const btn=document.getElementsByTagName('button')
let errBox=document.getElementById('err-box')


btn[0].addEventListener('click',(e)=>{
    e.preventDefault();
    let userId=ip[0].value
let password=ip[1].value
    fetch('/login',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            userId,
            password
        })
    })
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        if (data.err) errBox.innerText = data.msg
        if (!data.err) window.location.href = data.redirect
    })
    .catch(err => {
        console.log(err)
    })
})