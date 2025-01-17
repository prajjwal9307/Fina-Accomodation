const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review=require("./review.js")
const User=require("./user.js");
const { string } = require("joi");
const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    image: {
        url:String,
        filename:String,
    },

    price: {
        type: Number,

    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        onum:["Trending","Rooms","IconicCity","Mountain","Castles","AmazingPool","Camping"],
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})



const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing;


