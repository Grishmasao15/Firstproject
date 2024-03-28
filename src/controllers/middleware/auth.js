exports.auth=(req,res,next)=>{
    if(!req.cookie.token){

        res.redirect("/directlogin");

    }
    next();

}