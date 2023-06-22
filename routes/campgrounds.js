const express = require("express");
const router = express.Router();
//require wrapAsync
const wrapAsync = require("../utilities/wrapAsync");
//require controller file with campground routes
const campgrounds = require("../controllers/campcontrol");
//require Campground module
const Campground = require("../models/campground");

//Middelware import(s)
const { isLoggedIn, validateCampground, isAuthorized } = require("../middleware");
const campground = require("../models/campground");

//Cloudinary - for storing img uploads
//Note: you don't have to put '/index' as Node will automatically look for an index file in a folder.
const { storage } = require("../cloudinary/index");
//Multer - for 'multiple/form-data' parsing
const multer = require("multer");
const upload = multer({ storage }); //instructing Multer to store data parsed from form in storage object created in cloudinary folder and/or file.

//*** ROUTES ***/
//Use 'router.route' to group routes and further consolidate and clean up code.

//*** Group Routes for '/' ***//
router
  .route("/")
  //Camprounds Index Page Route
  .get(wrapAsync(campgrounds.index))
  //New campground Submit Route (and Redirect)
  // .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.newCamp));

  //updload.single() = Multer function which will grab the file in the field labeled/named 'image' in the New Campground form and add that file to Multer to parse
  .post(upload.array("image"), (req, res) => {
    console.log(req.body, req.files);
    res.send("It worked!");
    // res.send(req.body, req.file);
  });

//New Campground Form Route
//remember: don't need an async callback for creating a new item since there is nothing to wait for beforehand
//NOTE!: The create route needs to come BEFORE the show route, otherwise the server will search - and not find - an item with the id of 'new'
router.get("/new", isLoggedIn, campgrounds.newForm);

//*** Group Routes for '/:id' ***//
router
  .route("/:id")
  //Campground Details Page Route
  .get(wrapAsync(campgrounds.showCamp))
  //Camprgound Edit Submission Route and Redirect
  .put(isLoggedIn, isAuthorized, validateCampground, wrapAsync(campgrounds.updateCamp))
  //Delete Route
  .delete(isLoggedIn, isAuthorized, wrapAsync(campgrounds.deleteCamp));

//Edit Campground Route
router.get("/:id/edit", isLoggedIn, isAuthorized, wrapAsync(campgrounds.editCamp));

module.exports = router;
