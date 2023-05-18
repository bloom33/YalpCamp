//require Campground module
const Campground = require("../models/campground");
//require Review module
const Review = require("../models/review");

//Post New Reeview
module.exports.newReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  //variable which holds the value of a newly created review written in the form's review body
  const review = new Review(req.body.review);
  //connects/attaches the review to the logged in user.
  review.user = req.user._id;
  // add/attach review to specific campground
  campground.reviews.push(review);
  // save new review and then "new" campground (i.e. campground w/review attached)
  await review.save();
  //we save the campground as well because we are storing a reference to the review in the camprgounds array, called 'reviews'.
  await campground.save();
  //flash message
  req.flash("success", "Sucessfully added review!");
  //redirect back to individual campground show page
  res.redirect(`/campgrounds/${campground.id}`);
};

//
module.exports.deleteReview = async (req, res) => {
  //Grab the id to pass into findByIdAndUpdate function
  const { id, reviewId } = req.params;
  //$pull operator removes from an existing array all instances of a value(s) that match a specified condition. Thus, this operator will pull the review with the matching reviewId out of the array of reviews array.
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  //flash message
  req.flash("success", "Sucessfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
