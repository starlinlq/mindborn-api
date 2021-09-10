const jwt = require("jsonwebtoken");
const CustomError = require("../errors/customError");
require("dotenv").config();

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer ")) {
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } else {
    next(new CustomError("Unathorize", 401));
  }
};

module.exports = auth;
