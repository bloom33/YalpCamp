//"import"/require mongoose
const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    //'unique' is not actually considered a validator; it sets up an index, thus, if you use vlaidating middleware, 'unique: true' will not be considered in the function.
    unique: true,
  },
});

//This is going to add on to the schema a username and a field for password. It's going to make sure the username is unique and provide other methods we cna use.
UserSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", UserSchema);
