const photoUpload = require("../features/cloudinary");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const upload = async (req, res, next) => {
  const {
    photo: { tempFilePath },
  } = req.files;
  try {
    const { url } = await photoUpload(tempFilePath);
    if (url) {
      return res.status(StatusCodes.OK).json({ url });
    }
    next(new CustomError("something went wrong", StatusCodes.BAD_REQUEST));
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

module.exports = upload;
