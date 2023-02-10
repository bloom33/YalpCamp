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

//function which picks a random name form the arrays in seedHelpers file, set to a variable
const randomTitle = (array) => array[Math.floor(Math.random() * array.length)];

//Asynchronous function which creates a list of 50 randomized campgrounds
const seedDB = async () => {
  await Campground.deleteMany({});
  //   const c = new Campground({ title: "pink fields" });
  //   await c.save();

  //Loop through array in cities.js at random and assign the city and state which matches the random number as the value to the location key in a newly created camp
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //manually assigned already created camprgounds to a fictional user's id so to not have issues in the app further down the line.
      user: "63e327dad300dc47bf60de3c",
      title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam minus optio temporibus explicabo unde! Assumenda accusantium eius ab, reiciendis molestias officiis iusto recusandae, excepturi aut a mollitia voluptate. Quas, fugiat? Quod perspiciatis ea veritatis, mollitia praesentium porro inventore nemo cum! Porro eligendi sapiente delectus eum aspernatur nisi beatae, architecto rem, soluta quia officia. Exercitationem recusandae illo corrupti dignissimos labore ea?",
      price: price,
    });
    //save the newly created camp AFTER its newly assigned values of city and state are created in the loop function above
    await camp.save();
  }
};

//After creating and giving function functionality, execute the function; then, have the connection close
seedDB().then(() => {
  mongoose.connection.close();
});
