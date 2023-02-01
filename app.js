//require/"import" express
const express = require("express");
//assign express function execution to a variable
const app = express();
//require/"import" path to use for directing path to views folder
const path = require("path");
//"import"/require mongoose
const mongoose = require("mongoose");
//require method-override in order to send patch, put, delete reuquest routes
const methodOverride = require("method-override");
//import ejs-mate (to use boilerplate template)
const ejsMate = require("ejs-mate");
//require ExpressError
const ExpressError = require("./utilities/ExpressError");
//require wrapAsync
const wrapAsync = require("./utilities/wrapAsync");
//import joi schema
const { campgroundSchema, reviewSchema } = require("./schemas");
//require Campground module
const Campground = require("./models/campground");
//require Review module
const Review = require("./models/review");

//Getting default connection to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("CONNECTION OPEN!!!");
}

//catch any errors with connecting to mongoose
main().catch((err) => console.log(err));

//*** EJS SETUP ***/
//so Express can read and render ejs syntax
app.set("view engine", "ejs");
//set so Express is directed automatically to render ejs templates from the views folder
app.set("views", path.join(__dirname, "views"));
//Tells Express to use ejs-mate engine instead of its default
app.engine("ejs", ejsMate);

//*** EXPRESS MIDDLEWARE ***/
//Function used to parse the request body/req.body of the form so that its contents can be input into the request object so it can be used as a JS object
app.use(express.urlencoded({ extended: true }));
//Function assigning method-override to perform the request denoted/labeled in the query string by the string provided - i.e. '_method'.
app.use(methodOverride("_method"));

//*** JOI MIDDLEWARE ***/
//Function which validates the campground submission form before it reaches mongoose
const validateCampground = (req, res, next) => {
  //Next, after schema is defined, pass thorugh values to it.
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    //map over error details array
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//Function which validates the reviews submission form/properties before it reaches mongoose
const validateReview = (req, res, next) => {
  //Next, after schema is defined, pass thorugh values to it.
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    //map over error details array
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//*** CAMPGROUND ROUTES START HERE! !***//
app.get("/", (req, res) => {
  res.render("Home");
});

//Camprounds Index Page Route
app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    // assign function which will find all campgrounds to a variable
    const campgrounds = await Campground.find({});
    //renders index.ejs page and passes campgrounds values to index.ejs
    res.render("campgrounds/index", { campgrounds });
  })
);

//New Campground Form Route
//remember: don't need an async callback for creating a new item since there is nothing to wait for beforehand
//NOTE!: The create route needs to come BEFORE the show route, otherwise the server will search - and not find - an item with the id of 'new'
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//New campground Submit Route (and Redirect)
app.post(
  "/campgrounds",
  validateCampground,
  wrapAsync(async (req, res) => {
    //Throws an error message if user attempts to create a new campground without a title.
    // if (!req.body.campground)throw new ExpressError("Invalid Campground Data", 400);

    //The new campground created will be populated by the values input in the body of the form
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Campground Details Page Route
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    console.log(campground);
    res.render("campgrounds/show", { campground });
  })
);

//Edit Campground Route
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

//Camprgound Edit Submission Route and Redirect
app.put(
  "/campgrounds/:id",
  validateCampground,
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;
    //Note: when using findByIdAndUpdate(), remember to pass in two parameters: the id of the item being updated - and - the properties being updated
    //Use the spread operator to populate campground item with the values from the form which match the respective keys located in the item object
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

//Delete Route
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//*** REVIEWS ROUTES ***//
//Reviews: Post Route
app.post(
  "/campgrounds/:id/reviews",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    //variable which holds the value of a newly created review written in the form's review body
    const review = new Review(req.body.review);
    // add/attach review to specific campground
    campground.reviews.push(review);
    // save new review and then "new" campground (i.e. campground w/review attached)
    await review.save();
    await campground.save();
    //redirect back to individual campground show page
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

app.delete(
  //2 IDs are listed in the url because we want to delete the review from the specific campground it's associated with as well as the specific review.
  "/campgrounds/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id, reviewId } = req.params;
    //$pull operator removes from an existing array all instances of a value(s) that match a specified condition. Thus, this operator will pull the review with the matching reviewId out of the array of reviews array.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

//For EVERY SINGLE/path request. ORDER = IMPORTANT!
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Catch-all/Default error route ORDER = IMPORTANT - this MUST be last!
app.use((err, req, res, next) => {
  //destructure from err
  const { status = 500 } = err;
  //transfered error message and it's value OUT of destructuring in order to pass it on as a variable to error.ejs
  if (!err.message) err.message = "Something went wrong!";
  // console.log(status, message);
  res.status(status).render("error", { err });
});

//testing code
// app.get("/makecamp", async (req, res) => {
//   const camp = new Campground({
//     title: "Backyard!",
//     description: "cheap camping!",
//   });
//   await camp.save();
//   res.send(camp);
// });

//listening port for application
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
