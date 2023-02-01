const express = require("express");
const router = express.Router({ mergeParams: true });
//require wrapAsync
const wrapAsync = require("../utilities/wrapAsync");
//require ExpressError
const ExpressError = require("../utilities/ExpressError");
//require Campground module
const Campground = require("../models/campground");
//require Review module
const Review = require("../models/review");
//import joi schema
const { reviewSchema } = require("../schemas");

//*** JOI MIDDLEWARE ***/
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

//Reviews: Post Route
router.post(
  "/",
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

router.delete(
  //2 IDs are listed in the url because we want to delete the review from the specific campground it's associated with as well as the specific review.
  "/:reviewId",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id, reviewId } = req.params;
    //$pull operator removes from an existing array all instances of a value(s) that match a specified condition. Thus, this operator will pull the review with the matching reviewId out of the array of reviews array.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
