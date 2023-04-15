<<<<<<< HEAD
function Time() {
    var log = new Date()


    // Adding time elements to the div
    document.getElementById("digital-clock").innerText = "Last logged at: \n"+log.toLocaleString();

    // Set Timer to 1 sec (1000 ms)
    // setTimeout(Time, 1000);


}



Time();
=======
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


>>>>>>> 3ca4dc4e4b4fb66a5a2c51700beb0b6752b2428f
