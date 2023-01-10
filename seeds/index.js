//"import"/require mongoose
const mongoose = require("mongoose");
//require Campground
const Campground = require("../models/campground");
//require cities in order to access the cities array
const cities = require("./cities");
//import array modules from seedHelpers file
const { places, descriptors } = require("./seedHelpers");

//Getting default connection to MongoDB
async function main() {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("CONNECTION OPEN!!!");
}

// Get the default connection
const db = mongoose.connection;

//catch any errors with connecting to mongoose
main().catch((err) => console.log(err));

const randomTitle = (array) =>
  //function which picks a random name form the arrays in seedHelpers file
  array[Math.floor(Math.random() * array.length)];

//
const seedDB = async () => {
  await Campground.deleteMany({});
  //   const c = new Campground({ title: "pink fields" });
  //   await c.save();

  //Loop through array in cities.js at random and assign the city and state which matches the random number as the value to the location key in a newly created camp
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    //save the newly created camp AFTER its newly assigned values of city and state are created in the loop function above
    await camp.save();
  }
};

//After creating and giving function functionality, execute the function; then, have the connection close
seedDB().then(() => {
  mongoose.connection.close();
});
