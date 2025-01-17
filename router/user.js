const express=require("express")
const router=express.Router()
const User=require("../models/user.js")
const passport=require("passport")
const { saveredirectUrl } = require("../middleware.js")
const controluser=require("../controller/user.js")

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})

router.post("/signup",controluser.signup)

router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),controluser.login)

router.get("/logout",controluser.logout)
module.exports=router;