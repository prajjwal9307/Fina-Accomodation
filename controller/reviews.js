
const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.reviewCreate=async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        newReview.author=req.user._id;
        // console.log(newReview);
        await newReview.save();
        listing.reviews.push(newReview);
        await listing.save();
        req.flash("success","New Review Created !")
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error adding review:", error.message);
        res.status(400).send("Error saving review. Please ensure all fields are filled.");
    }
}

module.exports.deletereviews=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}