const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jordane66@ethereal.email',
        pass: 'nbjXWNkUBSmz31R7zw'
    }
});
exports.generateOTP=()=>{
    let digits='0123456789'
    let otp=''
    for(let i=0;i<6;i++){
        otp+=digits[Math.floor(Math.random()*10)];
    }
    return otp
}
exports.sendOTP = (email, name,otp) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
             from: 'jordane66@ethereal.email',
             to:email,
             subject:'OTP for email confirmation',
             html:`
             <p>Hey ${name}</p>
             <p>OTP for verification at OSL registration is: <b> ${otp}</b>
             </p>
             <p> Please do not share this.</p>
             <P> Ignore if not done by you</p>
             `
            }).then(msg=>{
                console.log("Email sent");
                resolve({err:false,msg:'OTP sent successfully'})
            }).catch(err=>{
                console.log(err)
                reject({err:true,msg:`Couldn't sent OTP. Please try again later.`})
            })
    })
}

