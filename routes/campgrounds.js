const express = require("express");
const router = express.Router();
//require wrapAsync
const wrapAsync = require("../utilities/wrapAsync");

//require Campground module
const Campground = require("../models/campground");

//Middelware import(s)
const {
  isLoggedIn,
  validateCampground,
  isAuthorized,
} = require("../middleware");

//*** ROUTES ***/
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
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//New campground Submit Route (and Redirect)
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    //Throws an error message if user attempts to create a new campground without a title.
    // if (!req.body.campground)throw new ExpressError("Invalid Campground Data", 400);

    //The new campground created will be populated by the values input in the body of the form
    const campground = new Campground(req.body.campground);
    //Now that we have authorization incorporated, we can assign a user/user id to a newly created campground, using the 'req.user' added by Passport
    campground.user = req.user._id;
    await campground.save();
    //flash message for creating a new camprgound
    req.flash("success", "Sucessfully added a new Campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Campground Details Page Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("user");
    // console.log(campground);
    //Add function which will display error message when a specific campground doesn't exist/cannot be found.
    if (!campground) {
      req.flash("error", "Cannot find that Camprgound");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

//Edit Campground Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthorized,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(id);
    //Add function which will display error message when a user attempts to edit a specific campground which doesn't exist/cannot be found.
    if (!campground) {
      req.flash("error", "Can't find that Camprgound");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

//Camprgound Edit Submission Route and Redirect
router.put(
  "/:id",
  isLoggedIn,
  isAuthorized,
  validateCampground,
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;

    //Note: when using findByIdAndUpdate(), remember to pass in two parameters: the id of the item being updated - and - the properties being updated
    //Use the spread operator to populate campground item with the values from the form which match the respective keys located in the item object
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // }); //CANCELED CODE END (2/27/23): we are deleting / rewriting this code for authorization purposes; to make sure that no-one but the authorized creator of a camprgound, can alter/edit it. Thus, we need to FIND the campground's id first, check to see if the current user has the authority/authorization to edit the current campground, then allow editing capabilities if they are.
    req.flash("success", "Sucessfully updated Campground!");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isAuthorized,
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);
    //flash message
    req.flash("success", "Sucessfully deleted Campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
