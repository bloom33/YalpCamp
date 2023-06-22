// import joi
const Joi = require("joi");

//Joi will validate form data before beginning to save another campground, using mongoose:
//First, define schema
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

//Joi will validate form data before beginning to save another review, using mongoose:
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
