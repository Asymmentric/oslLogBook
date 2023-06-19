

const timeBlock=document.getElementById('lastLoginTime')
const dateBlock=document.getElementById('lastLoginDate')
const nameBlock=document.getElementById('userName')
const exitLogBlock=document.getElementsByClassName('exitLog')
const exitContainer=document.getElementById('exit-container')

exitLogBlock[0].addEventListener('click',(e)=>{
    fetch('/oslLog/exit',{
        method:'post',
        body:''
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.err) location.reload()
        console.log(data.msg)
        dateBlock.innerText='\n\n Exit at \n\n'+new Date(data.msg)+'\n\n'
    })
})

document.body.addEventListener('load',time())
async function time(){
    fetch('/livepage',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        }
        })
        .then(response=>response.json())
        .then(lastLoginDetails=>{
            if(lastLoginDetails.err){
                window.location.href='/logout'
            }else{
            let timeNow=new Date()
            let lastLog=new Date(lastLoginDetails.time)
            let nameOfUser=lastLoginDetails.nameOfUser
            nameBlock.innerText=`[ ${nameOfUser.charAt(0).toUpperCase()}${nameOfUser.slice(1)} ]\n`
            dateBlock.innerText='\n\n '+lastLoginDetails.msg+' \n\n'+lastLog+'\n\n'
            if(!lastLoginDetails.status){
                exitContainer.innerHTML=''
                // document.body.style.backgroundImage=`radial-gradient(ellipse at center,  #d3202f  0%, #000000 70%);`
                document.body.style.backgroundColor='white'
            }

            }
        })

    
}




