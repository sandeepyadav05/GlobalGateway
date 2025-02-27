const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/userRouter.js");
const session = require("express-session");
const cookie = require("express-session/session/cookie.js");
const flash = require("connect-flash");
const  passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
//app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



// app.get("/", (req,res) => {
//     res.send("working");
// });

app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
});





app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

  


// app.get("/testListing", async (req,res) => {
//   let sampleListing = new Listing({
//     title: "My new listing",
//     description: "By the beach",
//     price: 1200,
//     location: "goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "Something went Wrong"} = err;
    res.status(statusCode).render("error.ejs", {message})
   // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("server is running on port 8080");
});