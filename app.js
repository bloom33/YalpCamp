//require/"import" express
const express = require("express");
//assign express function execution to a variable
const app = express();
//require/"import" path to use for directing path to views folder
const path = require("path");
//"import"/require mongoose
const mongoose = require("mongoose");
//require Campground
const Campground = require("./models/campground");

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

//Command Express to parse the body of the request form so that its contents can be rendered
app.use(express.urlencoded({ extended: true }));

//CRUD ROUTES START HERE!!***//
app.get("/", (req, res) => {
  res.render("Home");
});

//routes to display Camprounds index page / list of campgrounds
app.get("/campgrounds", async (req, res) => {
  // assign function which will find all campgrounds to a variable
  const campgrounds = await Campground.find({});
  //renders index.ejs page and passes campgrounds values to index.ejs
  res.render("campgrounds/index", { campgrounds });
});

//remember: don't need an async callback for creating a new item since there is nothing to wait for beforehand
//NOTE!: The create route needs to come BEFORE the show route, otherwise the server will search - and not find - an item with the id of 'new'
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//End point route to submit 'new campground' form to
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

//routes to details page of a specific campground
app.get("/campgrounds/:id", async (req, res) => {
  // need to look up / find the selected camprgound by id
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
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
