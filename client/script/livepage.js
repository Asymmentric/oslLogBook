const timeBlock=document.getElementById('lastLoginTime')
const dateBlock=document.getElementById('lastLoginDate')
const nameBlock=document.getElementById('userName')
async function time(){
    fetch('/livepage',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        }
        })
        .then(response=>response.json())
        .then(lastLoginDetails=>{
            let timeNow=new Date()
            let lastLog=new Date(lastLoginDetails.lastLogin)
            let nameOfUser=lastLoginDetails.nameOfUser
            nameBlock.innerText=`[ ${nameOfUser.charAt(0).toUpperCase()}${nameOfUser.slice(1)} ]\n`
            dateBlock.innerText='\n\n Last Logged at \n\n'+lastLog+'\n\n'
        })

    
}

time()


