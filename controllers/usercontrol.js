//require User model
const { model } = require("mongoose");
const User = require("../models/user");

//Displays registraiton form
module.exports.reForm = (req, res) => {
  res.render("userAuth/register");
};

//Registers new User. i.e. posts regsitration form to server/site
module.exports.regUser = async (req, res, next) => {
  //although 'wrapAsync' automatically trie and catches errors, you can try-catch within it in order to display a customized error message, etc
  try {
    //first: deconstruct / extract what you want from the "form-body"/body of the form
    const { username, email, password } = req.body;
    //next/second: pass on information to the new object/model - and save to a variable
    const user = new User({ username, email });
    //then/third: call '.register()' method and pass on to it the entire instance of the new user, held in the variable 'user' and the password (salt+hash) and store that with the new user, when it saves the new user to the database
    //Remember to 'await' this step so the app doesn't move on until it's done
    const registeredUser = await User.register(user, password); //note: '.register()' is a Passport method, which will salt and store the password itself, so we don't have to manually do it

    //'.login()' =  Passport helper method (like 'logout()) automatically added to the request object/that can be used on the request object
    //note: requires a callback function
    //this function logs in a newly registered user, so they don't have to login after having registered, as an extra step
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

//Displays login form
module.exports.loginForm = (req, res) => {
  res.render("userAuth/login");
};

//Technically only redirects user to previous page after having been successfully logged in by the authenticator code
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  //After user has logged in, redirect them to where they left off, IF it's not "/campgrounds", otherwise take them to "/campgrounds"
  const redirectUrl = req.session.returnTo || "/campgrounds";
  //
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

//Logs user out
module.exports.logout = (req, res) => {
  req.flash("success", "Welcome back!");
  //After user has logged in, redirect them to where they left off, IF it's not "/campgrounds", otherwise take them to "/campgrounds"
  const redirectUrl = req.session.returnTo || "/campgrounds";
  //
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
