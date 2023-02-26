const ip=document.getElementsByTagName('input')



ip[2].addEventListener('click',(e)=>{
    // e.preventDefault();
    let usn=ip[0].value
let password=ip[1].value
    fetch('/login',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            usn:usn,
            email:usn,
            password
        })
    })
    .then(data=>data)
})