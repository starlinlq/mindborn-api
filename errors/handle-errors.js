const CustomError = require("./customError");

const handleErrors = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ msg: err.message });
  }
  return res.status(500).json({ err });
};
module.exports = handleErrors;
