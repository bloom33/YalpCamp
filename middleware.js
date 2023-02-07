//Middleware function which checks whether or not a user is authenticated before allowing them to access to specified sections of the site
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Need to be signed in.");
    return res.redirect("/login");
  }
  next();
};
