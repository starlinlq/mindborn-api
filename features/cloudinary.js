const cloudinary = require("cloudinary").v2;
require("dotenv");
cloudinary.config({
  cloud_name: "starlinlq",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARYAPI_SECRET,
  secure: true,
});

const upload = async (file) => {
  return cloudinary.uploader.upload(file);
};

module.exports = upload;
