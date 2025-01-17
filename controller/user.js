const User=require("../models/user.js")
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({
            email,username
        });
        const registerUser=await User.register(newUser,password);
        console.log(registerUser)
        req.login(registerUser,(err)=>{
            if(err){
                return next(err)
            }
        req.flash("success","Welcome to Wanderlust !")
        res.redirect("/listings")
        })
        
    }catch(e){
        req.flash("success",e.message)
        res.redirect("/signup")
    }
   
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are log out!")
        res.redirect("/listings")
    })
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}