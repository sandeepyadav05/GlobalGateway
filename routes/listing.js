const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review");
const {isLoggedIn, isOwner, validateListing} = require("../middleware"); // Ensure this path is correct
const listingController = require("../controllers/listing.js")





// Validate Listing


// // index route

router.get("/", wrapAsync(listingController.index) );

//
// app.get("/listings", async (req, res) => {
//     try {
//         const allListing = await Listing.find({});
//         console.log("Fetched Listings:", allListing); // Debugging line
//         res.render("./listings/index.ejs", { allListing });
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         res.render("./listings/index.ejs", { allListing: [] });
//     }
// });

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);


// router.get("/new",isLoggedIn,  (req, res) => {
    
//     res.render("listings/new"); // Corrected path
// });


//show route
router.get("/:id", wrapAsync(listingController.showListings));





 //create route

//  router.post("/", validateListing, wrapAsync(async(req,res,next) => {
//     // let {title, description, image, price, country,location} = req.body;
//    // let listing = req.body.listing;

// //    if(!req.body.listing){
// //     throw new ExpressError(400,"Send valid data for listing.")
// //    }

    
   
//     const newListing =  new Listing(req.body.listing);
//     await newListing.save();
//      res.redirect("/listings");
  
 
//    })
// );

router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));


 //
//  app.post("/listings", async (req, res) => {
//     try {
//         let newListingData = req.body.listing;
//         newListingData.price = newListingData.price ? Number(newListingData.price) : 0;  // Ensure price exists

//         const newListing = new Listing(newListingData);
//         await newListing.save();
//         res.redirect("/listings");
//     } catch (error) {
//         console.error("Error creating listing:", error);
//         res.status(500).send("Error saving listing");
//     }
// });



// edit route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// update route
// router.put("/:id", validateListing, wrapAsync(async (req,res) => {
//    let {id} = req.params;
//    await Listing.findByIdAndUpdate(id, {...req.body.listing});
//    res.flash("success", "New Listing Created");
//    res.redirect("/listings");
// }));

router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));



// delete route

router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;