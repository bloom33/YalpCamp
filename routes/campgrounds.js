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

//*** ROUTES ***/
//Use 'router.route' to group routes and further consolidate and clean up code.

//*** Group Routes for '/' ***//
router
  .route("/")
  //Camprounds Index Page Route
  .get(wrapAsync(campgrounds.index))
  //New campground Submit Route (and Redirect)
  .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.newCamp));

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
