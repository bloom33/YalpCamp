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
//require ExpressError
const ExpressError = require("./utilities/ExpressError");
//Route(r) imports
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

//*** MONGOOSE SET-UP ***//
//Getting default connection to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("CONNECTION OPEN!!!");
}
//catch any errors with connecting to mongoose
main().catch((err) => console.log(err));

//*** EJS SETUP ***//
//so Express can read and render ejs syntax
app.set("view engine", "ejs");
//set so Express is directed automatically to render ejs templates from the views folder
app.set("views", path.join(__dirname, "views"));
//Tells Express to use ejs-mate engine instead of its default
app.engine("ejs", ejsMate);

//*** EXPRESS MIDDLEWARE ***//
//Function used to parse the request body/req.body of the form so that its contents can be input into the request object so it can be used as a JS object
app.use(express.urlencoded({ extended: true }));
//Function assigning method-override to perform the request denoted/labeled in the query string by the string provided - i.e. '_method'.
app.use(methodOverride("_method"));

//*** ROUTING MIDDLEWARE ***//
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//*** ROUTES START HERE! !***//
app.get("/", (req, res) => {
  res.render("Home");
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
