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
//Camprounds Index Page Route
router.get("/", wrapAsync(campgrounds.index));

//New Campground Form Route
//remember: don't need an async callback for creating a new item since there is nothing to wait for beforehand
//NOTE!: The create route needs to come BEFORE the show route, otherwise the server will search - and not find - an item with the id of 'new'
router.get("/new", isLoggedIn, campgrounds.newForm);

//New campground Submit Route (and Redirect)
router.post("/", isLoggedIn, validateCampground, wrapAsync(campgrounds.newCamp));

//Campground Details Page Route
router.get("/:id", wrapAsync(campgrounds.showCamp));

//Edit Campground Route
router.get("/:id/edit", isLoggedIn, isAuthorized, wrapAsync(campgrounds.editCamp));

//Camprgound Edit Submission Route and Redirect
router.put("/:id", isLoggedIn, isAuthorized, validateCampground, wrapAsync(campgrounds.updateCamp));

//Delete Route
router.delete("/:id", isLoggedIn, isAuthorized, wrapAsync(campgrounds.deleteCamp));

module.exports = router;
