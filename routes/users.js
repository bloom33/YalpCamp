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
//require necessary middleware to store user sessions
const { storeReturnTo } = require("../middleware");

//*** Group Routes for '/register' ***//
router
  .route("/register")
  //Route to render/display User Registration form
  .get(users.reForm)
  //Route to which user reg form is posted
  .post(wrapAsync(users.regUser));

//*** Group Routes for '/register' ***//
router
  .route("/login")
  //Route to render/display User Login form
  .get(users.loginForm)
  //Route  to which user login form is posted
  .post(
    //Middleware used to save the returnTo value from session to res.locals. Passport.js update. Now users will be successfully rerouted back to the page they were on before login.
    storeReturnTo,
    //Passport automaticaaly comes with a method called '.autheticate()' to which you can pass what type of authentication (local, gogle, twitter, etc) and validator options
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      // keepSessionInfo: true, --- deprecated code due to Passport.js update
    }),

    // users.login --- deprecated / deleted code due to Passport.js update. New / Replacement code below:
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
      req.flash("success", "Welcome back!");
      // update this line to use res.locals.returnTo now
      const redirectUrl = res.locals.returnTo || "/campgrounds";

      res.redirect(redirectUrl);
    }
  );

//Logout route
// router.get("/logout", users.logout);

//New version of above code due to recent Passport.js updates. (6/13/23)
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
