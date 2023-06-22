const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//This configuration is essentially associating your cloudinary account with this instance of cloudinary in the app
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//Instantiating instance of cloudinary storage. i.e. creating a real instance / particular realization of cloudinary storage.
//Essentially CloudinaryStorage is configured with the proper credntials for my specific cloudinary account (in above code) and, below, are the specific folder in that account in which I'd like things stored and info on the allowed formats of the files uploaded through the app
const storage = new CloudinaryStorage({
  cloudinary,
  folder: "YelpCamp", //the folder in cloudinary that we will store things in
  allowedFormats: ["jpeg", "jpg", "png"],
});

module.exports = { cloudinary, storage };
