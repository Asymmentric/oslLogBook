const ip=document.getElementsByTagName('input')



ip[4].addEventListener('click',(e)=>{
    let usn=ip[0].value
    let email=ip[1].value
    let userName=ip[2].value
    let password=ip[3].value
    console.log('sdfsdf')
    fetch('/register',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            usn,name:userName,email,password
        })
    })
    .then(data=>data)
})