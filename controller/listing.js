const listing=require("../models/listing.js")
const Listing=require("../models/listing.js")
module.exports.index=async(req,res)=>{
    const allListing=await listing.find({})
    res.render("listings/index.ejs",{allListing})

};

module.exports.showroute=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listings You requested does not exits!")
        res.redirect("/listings");
    }

    res.render("listings/show.ejs",{listing})
}

module.exports.createroute=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
    console.log(req.body); // Check the incoming request data
    const { title, description, image, price, country, location,category} = req.body;

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        category,
        image: { url: image || undefined }
    });
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    await newListing.save()
        .then(() => {
            console.log("Listing saved successfully!");
        })
        .catch((err) => {
            console.error("Error saving listing:", err);
            res.status(400).send("Error saving listing.");
        });

        req.flash("success","New Listings Created !")
    res.redirect("/listings");
}

module.exports.editroute=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listings You requested does not exits!")
        res.redirect("/listings");
    }
    let url=listing.image.url;
    url=url.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,url})
}


module.exports.updateroute = async (req, res) => {
    try {
        const { id } = req.params;

        // Extract update data from req.body
        const updates = { ...req.body };

        // Handle file upload (if present)
        if (req.file) {
            updates.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        // Update the listing with the provided fields
        const listing = await Listing.findByIdAndUpdate(id, updates, { new: true });
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error.message);
        req.flash("error", "An error occurred while updating the listing.");
        res.redirect(`/listings/${id}`);
    }
};








module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listings Delete !")
    res.redirect("/listings")
}