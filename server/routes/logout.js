exports.logoutFunc=(req,res)=>{
    res.clearCookie('oslLogAuthUSN')
    res.clearCookie('oslLogUser')
    res.redirect('/')
}