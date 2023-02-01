//"import"/require mongoose
const mongoose = require("mongoose");
//a variable/reference for easily accessing or referring to the Schema property in mongoose in order to quickly reference it in code.
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

//export the module so it can be imported/required in other files
module.exports = mongoose.model("Review", reviewSchema);
