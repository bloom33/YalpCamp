//require/"import" express
const express = require("express");
//require router
const router = express.Router();
//require User model
const User = require("../models/user");
//require wrapAsync
const wrapAsync = require("../utilities/wrapAsync");
//require passport to use for user login post route
const passport = require("passport");
//require controller file with user routes
const users = require("../controllers/usercontrol");

//Route to render/display User Registration form
router.get("/register", users.reForm);

//Route to which user reg form is posted
router.post("/register", wrapAsync(users.regUser));

//Route to render/display User Login form
router.get("/login", users.loginForm);

//Route  to which user login form is posted
router.post(
  "/login",
  //Passport automaticaaly comes with a method called '.autheticate()' to which you can pass what type of authentication (local, gogle, twitter, etc) and validator options
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  users.login
);

//Logout route
router.get("/logout", users.logout);

module.exports = router;
