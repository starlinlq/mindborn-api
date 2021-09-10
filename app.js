require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const connectDB = require("./db/connect");
const notFound = require("./routes/notFound");
const handleErrors = require("./errors/handle-errors");
const post = require("./routes/post");
const authMiddleware = require("./middleware/authMiddleware");

//middleware
app.use(express.json());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", post);
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || "3000";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
