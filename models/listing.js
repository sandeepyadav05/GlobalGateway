const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,  // Fixed typo: should be 'required'
    },
    description: String,
    image: {
        filename: String,
        url: String,
      },

    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:" Review"
    }],
    owner: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;



// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: String,
//     description: String,
//     price: Number,
//     image: String,
//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: "Review"  // ✅ Ensure correct reference
//         }
//     ]
// });

// module.exports = mongoose.model("Listing", listingSchema);

