const express = require("express");
const router = express.Router();
//require wrapAsync
const wrapAsync = require("../utilities/wrapAsync");
//require ExpressError
const ExpressError = require("../utilities/ExpressError");
//require Campground module
const Campground = require("../models/campground");
//import joi schema
const { campgroundSchema } = require("../schemas");

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

//routes
//Camprounds Index Page Route
router.get(
  "/",
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
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

//New campground Submit Route (and Redirect)
router.post(
  "/",
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
router.get(
  "/:id",
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
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

//Camprgound Edit Submission Route and Redirect
router.put(
  "/:id",
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
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
