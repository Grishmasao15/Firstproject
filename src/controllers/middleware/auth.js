exports.auth=(req,res,next)=>{

    if(!req.cookies?.token){
             
        res.redirect("/directlogin");

    }
    next();

}