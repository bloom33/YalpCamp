//"import"/require mongoose
const mongoose = require("mongoose");
//a variable/reference for easily accessing or referring to the Schema property in mongoose in order to quickly reference it in code.
const Schema = mongoose.Schema;

//Create new schema.
//Note the use of 'Schema' instead of 'mongoose.Schema'
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

//export the module so it can be imported/required in other files
module.exports = mongoose.model("Campground", CampgroundSchema);
