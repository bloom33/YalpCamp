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
//require Campground
const Campground = require("./models/campground");
//require ExpressError
const ExpressError = require("./utilities/ExpressError");
//require wrapAsync
const wrapAsync = require("./utilities/wrapAsync");

//Getting default connection to MongoDB
async function main() {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("CONNECTION OPEN!!!");
}

//catch any errors with connecting to mongoose
main().catch((err) => console.log(err));

//so Express can read and render ejs syntax
app.set("view engine", "ejs");
//set so Express is directed automatically to render ejs templates from the views folder
app.set("views", path.join(__dirname, "views"));
//Tells Express to use ejs-mate engine instead of its default
app.engine("ejs", ejsMate);

//Express middleware function used to parse the body of the form so that its contents can be input into the request object so it can be used as a JS object
app.use(express.urlencoded({ extended: true }));
//Express middleware assigning method-override to perform the request denoted/labeled in the query string by the string provided - i.e. '_method'.
app.use(methodOverride("_method"));

//***CRUD ROUTES START HERE!!***//
app.get("/", (req, res) => {
  res.render("Home");
});

//routes to display Camprounds index page / list of campgrounds
app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    // assign function which will find all campgrounds to a variable
    const campgrounds = await Campground.find({});
    //renders index.ejs page and passes campgrounds values to index.ejs
    res.render("campgrounds/index", { campgrounds });
  })
);

//remember: don't need an async callback for creating a new item since there is nothing to wait for beforehand
//NOTE!: The create route needs to come BEFORE the show route, otherwise the server will search - and not find - an item with the id of 'new'
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//End point route to submit 'new campground' form to
app.post(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    //The new campground created will be populated by the values input in the body of the form
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//routes to details page of a specific campground
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

//routes to edit page of a specific campground
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    // need to look up / find the selected camprgound by id
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

//post edited camprgound route
app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;
    //Note: when using findByIdAndUpdate(), remember to pass in two parameters: the id of the item being updated - and - the properties being updated
    //Use the spread operator to populate campground item with the values from the form which match the respective keys located in the item object
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

//Delete route
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    //Grab the id to pass into findByIdAndUpdate function
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//For EVERY SINGLE request. ORDER = IMPORTANT!
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
  // res.send("404!!");
});

//Catch all error route ORDER = IMPORTANT!
app.use((err, req, res, next) => {
  //descrtucture from err
  const { status = 500, message = "Something went wrong!" } = err;
  // res.sendStatus(status).send(message);
  res.send(status).send(message);
  // res.send("No, something went wrong!");
});

//testing code
// app.get("/makecamp", async (req, res) => {
//   const camp = new Campground({
//     title: "Backyard!",
//     description: "cheap camping!",
//   });
//   await camp.save();
//   res.send(camp);
// });

//listening port for application
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
