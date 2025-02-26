const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/review.js")


// validating review


const validateReview = (req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
  
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// review route
router.post("/:id/reviews", validateReview, wrapAsync(reviewController.createReview));


  // delete review

  router.delete("/:reviewId",wrapAsync(reviewController.destroyReview)
);

// router.delete("/:reviewId", wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
    
//     let listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     req.flash("success", "Review deleted successfully!");
//     res.redirect(`/listings/${id}`);
// }));


module.exports = router;