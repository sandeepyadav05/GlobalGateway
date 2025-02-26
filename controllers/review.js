const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("New Review Added:", newReview);  // ✅ Debugging step
        console.log("Updated Listing:", listing);  // ✅ Debugging step

        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  };