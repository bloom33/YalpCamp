//require/"import" express
const express = require("express");
//assign express function execution to a variable
const app = express();
//require/"import" path to use for directing path to views folder
const path = require("path");
//"import"/require mongoose
const mongoose = require("mongoose");
//require method-override in order to send patch, put, delete reuquest routes
const methodOverride = require("method-override");
//import ejs-mate (to use boilerplate template)
const ejsMate = require("ejs-mate");
//import Express Sessions
const session = require("express-session");
//import flash for flash messages
const flash = require("connect-flash");
//require ExpressError
const ExpressError = require("./utilities/ExpressError");
//require User model
const User = require("./models/user");
//Passport imports:
const passport = require("passport");
const PassportLocal = require("passport-local");

//Route(r) imports
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

//*** MONGOOSE / DATABASE CONNECTION SET-UP ***//
//Getting default connection to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("CONNECTION OPEN!!!");
}
//catch any errors with connecting to mongoose
main().catch((err) => console.log(err));

//*** EJS / APP CONFIGURATION SETUP ***//
//so Express can read and render ejs syntax
app.set("view engine", "ejs");
//set so Express is directed automatically to render ejs templates from the views folder
app.set("views", path.join(__dirname, "views"));
//Tells Express to use ejs-mate engine instead of its default
app.engine("ejs", ejsMate);

//*** SESSIONS CONFIGURATION ***//
const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    //serves as an extra security measure to protect the user's session id from tampering and/or being revealed to the user/a third party
    httpOnly: true,
    //setting expiration can be tricky since Date.now() counts in miliseconds only; thus, you need to multiply it by: miliseconds in a min (1000), seconds (60), mins (60), hours (24), week (7) - to get the session last for a week.
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//*** EXPRESS MIDDLEWARE ***//
//Function used to parse the request body/req.body of the form so that its contents can be input into the request object so it can be used as a JS object
app.use(express.urlencoded({ extended: true }));
//Function assigning method-override to perform the request denoted/labeled in the query string by the string provided - i.e. '_method'.
app.use(methodOverride("_method"));
//Function for telling express to serve the 'public' directory and render static files conatained in it
app.use(express.static(path.join(__dirname, "public")));
//Functions needed to use passport / for consistent log-in sessions (as seen in Passport documentation)
app.use(passport.initialize());
//NOTE!: app.use(session()) MUST be ABOVE this session middleware for Passport Sessions to work!!
app.use(passport.session());
//"Passport, use PassportLocal, that was imported/required. For that method, the authentication method is located on the User model"
passport.use(new PassportLocal(User.authenticate()));
//Note: the serialization functions deal with how information is stored and retrieved from the session
//Function telling passport how to serialize a user. Essentially, how we store a user in a session
passport.serializeUser(User.serializeUser());
//...How to get a user OUT of a session.
passport.deserializeUser(User.deserializeUser());

//*** FLASH MESSAGING CONFIGURATION ***//
//Function to flash messages
app.use(flash());
//Middleware which will display flash messages inside the template, universally. NOTE: Placement = important. If you want it to have an effect on all routes, place before the route handlers as is done here.
//*** LOCALS = things that can be accessed throughout the local files stored in the app by using the keywords ("success", "error", etc)
app.use((req, res, next) => {
  console.log(req.session); //test code
  //Meaning = in our local files ('locals'), we'll have access to the success flash message, under the key of 'success'. This is so we don't have to pass to individual templates, but can always have access to it by inputting the leyword "success" in play (as in boilerplate.ejs)
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //for Passport's req.user method to be used to track user access
  res.locals.user = req.user;
  next();
});

//*** ROUTING MIDDLEWARE ***//
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//*** ROUTES START HERE! !***//
app.get("/", (req, res) => {
  res.render("home");
});

//*** ERROR ROUTES ***//
//For EVERY SINGLE/path request. ORDER = IMPORTANT!
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Catch-all/Default error route ORDER = IMPORTANT - this MUST be last!
app.use((err, req, res, next) => {
  //destructure from err
  const { status = 500 } = err;
  //transfered error message and it's value OUT of destructuring in order to pass it on as a variable to error.ejs
  if (!err.message) err.message = "Something went wrong!";
  // console.log(status, message);
  res.status(status).render("error", { err });
});

//listening port for application
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
