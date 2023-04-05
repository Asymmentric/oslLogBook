const timeBlock=document.getElementById('lastLoginTime')
const dateBlock=document.getElementById('lastLoginDate')
async function time(){
    fetch('/livepage',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        }
        })
        .then(response=>response.json())
        .then(time=>{
            let timeNow=new Date()
            let lastLog=new Date(time.lastLogin)
            dateBlock.innerText='\n\n Last Logged at \n\n'+lastLog+'\n\n'
        })

    
}

time()


