//"import"/require mongoose
const { string } = require("joi");
const mongoose = require("mongoose");
const { reviewSchema } = require("../schemas");
//a variable/reference for easily accessing or referring to the Schema property in mongoose in order to quickly reference it in code.
const Schema = mongoose.Schema;
//require Review module
const Review = require("./review.js");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//after setting up the images info into a new Schema, use the virtual() tool.
ImageSchema.virtual("thumbnail").get(function () {
  //this stores the url instead of the entire / actual file of the image; thus, keeping the functionality of resizing the images lightweight
  return this.url.replace("/upload", "/upload/w_200");
});

//Create new schema.
//Note the use of 'Schema' instead of 'mongoose.Schema'
const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  description: String,
  price: Number,
  location: String,
  //a reference to a user instance
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  //add a property to hold the object IDs of reviews associated with a specific campground
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Mongoose middleware which will make sure reviews from a deleted campground are found in the database and deleted as well
//Since it's dealing with something that's already been deleted, this is a 'post' operator.
//This function looks through all files stored in the document / doc array and will remove all reviews whose id fields match ids found in the doc that was just deleted.
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
//export the module so it can be imported/required in other files
module.exports = mongoose.model("Campground", CampgroundSchema);
