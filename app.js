if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
console.log(process.env.SECRET)
const express = require("express")
const app = express()
const mongoose = require("mongoose")
// const listing=require("./models/listing")
const path=require("path")
const Listing = require("./models/listing")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const expressError=require("./utils/expressError.js")
// const {listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/review.js")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
const userRouter=require("./router/user.js")
const {isLoggedIn,isOwner,validateListing,validateReview}=require("./middleware.js")

const controler=require("./controller/listing.js")
const controlerReview=require("./controller/reviews.js")
const router = require("./router/user.js")

const multer=require("multer")
const {storage}=require("./cloudinary.js")
const upload=multer({storage})

// Middle Ware For views
app.set('view engine',"ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname,"/public")));
// For Passing Data to params
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

// Mongoose Connection
const dbUrl=process.env.ATLASDB_URL;
main()
    .then((res) => {
        console.log("Mongoose Connect !")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


// Setup mongo
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err)
});

//express-session
const sessionOption={
    store,
    resave:false,
    saveUninitialized:true,
    secret:process.env.SECRET,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}






app.use(session(sessionOption));
app.use(flash())
// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})




app.use("/",userRouter);

// Route index/listings
app.get('/listings', wrapAsync(controler.index))

// new Route
app.get("/listings/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})





//Route Show
app.get("/listings/:id",wrapAsync(controler.showroute))

// Create Route
app.post("/listings",isLoggedIn,upload.single("image"),validateListing,wrapAsync(controler.createroute));



// Edit Route
app.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(controler.editroute))


// Update Route
app.put("/listings/:id",isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(controler.updateroute))

// Delete route
app.delete("/listings/:id",isLoggedIn,isOwner,wrapAsync(controler.delete))

// Reviews
// post route
app.post("/listings/:id/reviews",isLoggedIn,validateReview,controlerReview.reviewCreate);

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,wrapAsync(controlerReview.deletereviews))



app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found !"))
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went Wrong !"}=err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server listen 8080 Port !")
})
