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
