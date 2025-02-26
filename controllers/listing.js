const Listing = require("../models/listing")


module.exports.index = async (req,res) => {
    const allListing = await Listing.find({});
   res.render("./listings/index.ejs", {allListing});
};

module.exports.renderNewForm = (req,res) => {
    res.render("./listings/new.ejs")
 };

 module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner"); // Populate reviews
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async(req, res, next) => {
    const { title, description, image, price, country, location } = req.body.listing;

    const newListing = new Listing({
        title,
        description,
        image: {
            filename: "listingimage",  // You may modify this if needed
            url: image  // Ensure `image` is correctly extracted from req.body
        },
        price,
        location,
        country
    });
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Created!");
   // res.redirect(`/listings/${newListing._id}`);
   res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("./listings/edit.ejs", { listing });
    } catch (error) {
        res.status(500).send("Server error");
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const { title, description, image, price, country, location } = req.body.listing;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image: {
            filename: "listingimage",  // Ensure consistency
            url: image  // Store only the URL from req.body
        },
        price,
        location,
        country
    }, { new: true });

  //  req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
};