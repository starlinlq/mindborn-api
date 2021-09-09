const mongoose = require("mongoose");

const connectDb = (url) => {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

module.exports = connectDb;
