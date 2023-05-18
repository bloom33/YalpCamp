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
//require controller file with review routes
const reviews = require("../controllers/reviewcontrol");

//Middelware import(s)
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Reviews: Post Route
router.post("/", isLoggedIn, wrapAsync(reviews.newReview));

router.delete(
  //2 IDs are listed in the url because we want to delete the review from the specific campground it's associated with as well as the specific review.
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
