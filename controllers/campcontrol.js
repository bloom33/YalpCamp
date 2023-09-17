//require Campground module
const e = require("connect-flash");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

//Index of Campgrounds
module.exports.index = async (req, res) => {
  // assign function which will find all campgrounds to a variable
  const campgrounds = await Campground.find({});
  //renders index.ejs page and passes campgrounds values to index.ejs
  res.render("campgrounds/index", { campgrounds });
};

//Create New Campground Form
module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

//Creating /Submitting New Campground Info
module.exports.newCamp = async (req, res) => {
  //The new campground created will be populated by the values input in the body of the form
  const campground = new Campground(req.body.campground);
  //Maps over array of files added to cloudinary through multer and for every item/img in the array, grab path and filename and put them in an array
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  //Now that we have authorization incorporated, we can assign a user/user id to a newly created campground, using the 'req.user' added by Passport
  campground.user = req.user._id;
  await campground.save();
  console.log(campground);
  //flash message for creating a new camprgound
  req.flash("success", "Sucessfully added a new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);

  //CANCELED CODE: if (!req.body.campground)throw new ExpressError("Invalid Campground Data", 400); //Throws an error message if user attempts to create a new campground without a title.
};

//Diplays a Camp's Details
module.exports.showCamp = async (req, res) => {
  // need to look up / find the selected camprgound by id
  const campground = await Campground.findById(req.params.id)
    //populates all reviews for the specific campground being found/viewed, then populate onto each oneof them their author, then - sparately - populate the one author of the campground.
    .populate({ path: "reviews", populate: { path: "user" } })
    .populate("user");
  console.log(campground); //test
  //Add function which will display error message when a specific campground doesn't exist/cannot be found.
  if (!campground) {
    req.flash("error", "Cannot find that Camprgound");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

//Displays Edit Camp Page.
module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  // need to look up / find the selected camprgound by id
  const campground = await Campground.findById(id);
  //Add function which will display error message when a user attempts to edit a specific campground which doesn't exist/cannot be found.
  if (!campground) {
    req.flash("error", "Can't find that Camprgound");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

//Post Camp Edits
module.exports.updateCamp = async (req, res) => {
  //Grab the id to pass into findByIdAndUpdate function
  const { id } = req.params;
  console.log(req.body);
  //Note: when using findByIdAndUpdate(), remember to pass in two parameters: the id of the item being updated - and - the properties being updated
  //Use the spread operator to populate campground item with the values from the form which match the respective keys located in the item object
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  // variable: Maps over array of files added to cloudinary through multer and for every item/img in the array, grab path and filename and put them in an array
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));

  campground.images.push(...imgs); //adding 'push()' = not erasing imgs already saved but adding new ones.
  await campground.save(); //save new campground with pushed / added images.
  // }); //CANCELED CODE END (2/27/23): we are deleting / rewriting this code for authorization purposes; to make sure that no-one but the authorized creator of a camprgound, can alter/edit it. Thus, we need to FIND the campground's id first, check to see if the current user has the authority/authorization to edit the current campground, then allow editing capabilities if they are.

  if (req.body.deleteImages) {
    //after checking if there are images to be deleted, loop over the images, and delete the ones with matching filenames form cloudinary database
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //$pull operator = how we pull things out of an array
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    console.log(campground);
  }
  req.flash("success", "Sucessfully updated Campground!");
  res.redirect(`/campgrounds/${campground.id}`);
};

//Delete Camp
module.exports.deleteCamp = async (req, res) => {
  //Grab the id to pass into findByIdAndUpdate function
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);
  //flash message
  req.flash("success", "Sucessfully deleted Campground!");
  res.redirect("/campgrounds");
};
