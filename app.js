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

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/campgrounds", async (req, res) => {
  // assign function which will find all campgrounds to a variable
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
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
