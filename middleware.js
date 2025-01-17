const Review=require("./models/review.js");
const Listing=require("./models/listing.js");
const expressError=require("./utils/expressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged to create a listing !")
        return res.redirect("/login")
    }
    next();
}
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}


// Delete Update Edit Page Only those Create
module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You Dont's have permission to edit !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body.review);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errorMsg);
    }else{
        next();
    }
}



