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
  //add a property to hold the object IDs of reviews associated with a specific campground
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//export the module so it can be imported/required in other files
module.exports = mongoose.model("Campground", CampgroundSchema);
