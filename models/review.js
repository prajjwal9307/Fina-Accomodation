const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    Comment: {
        type: String,
       
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        
    },
    createAt: {
        type: Date,
        default: () => Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);


