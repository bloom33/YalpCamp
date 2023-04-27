//import joi schema
const { campgroundSchema, reviewSchema } = require("./schemas");
//require ExpressError
const ExpressError = require("./utilities/ExpressError");
//require Campground module
const Campground = require("./models/campground");
//import joi schema

//Middleware function which checks whether or not a user is authenticated before allowing them to access to specified sections of the site
module.exports.isLoggedIn = (req, res, next) => {
  //Passport automatically includes a method - '.user()' which automatically fills the request body with necessary info to identify a user based on stored data
  //   console.log("req.user", req.user);

  if (!req.isAuthenticated()) {
    //store url user was on before registering/logging in so they can be redirected to where they stopped, after doing so
    //check Passport documentation for info on .session, .returnTo, and .originalUrl - all of which are added Passport methods
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Need to be signed in.");
    return res.redirect("/login");
  }
  next();
};

//*** JOI MIDDLEWARE (for campground.js) ***/
//Function which validates the campground submission form before it reaches mongoose
module.exports.validateCampground = (req, res, next) => {
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

//Middleware to check if current user is authorized
module.exports.isAuthorized = async (req, res, next) => {
  //Grab the id to pass into findByIdAndUpdate function
  const { id } = req.params;
  //find the campground first
  const campground = await Campground.findById(id);
  //check if the current user has the authorization to edit the current campground, and if they don't, redirect them
  if (!campground.user.equals(req.user._id)) {
    req.flash("error", "You don't have authorization to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};

//*** JOI MIDDLEWARE (for reviews.js) ***/
//Function which validates the reviews submission form/properties before it reaches mongoose
module.exports.validateReview = (req, res, next) => {
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
