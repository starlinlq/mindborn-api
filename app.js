require("dotenv").config();
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const connectDB = require("./db/connect");
const notFound = require("./routes/notFound");
const handleErrors = require("./errors/handle-errors");
const post = require("./routes/post");
const commentRoutes = require("./routes/comment");
const profileRoutes = require("./routes/profile");
const upload = require("./controllers/upload");
const cors = require("cors");
const bookmarkRoutes = require("./routes/bookmark");
const conversationRoutes = require("./routes/conversations");
const messagesRoutes = require("./routes/messages");
const notificaitonsRoutes = require("./routes/notifications");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://optimistic-sammet-ffd7f3.netlify.app/",
  })
);

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(helmet());
//app.use(cors());
app.use(xss());
app.use(rateLimiter({ windowMs: 60 * 1000 }));

//routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", post);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/user", profileRoutes);
app.use("/api/v1/bookmark", bookmarkRoutes);
app.use("/api/v1/conversation", conversationRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/notification", notificaitonsRoutes);
//upload
app.post("/api/v1/upload", upload);
app.get("/", (req, res) => res.send("server running"));

//routes middleware
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || "3000";

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

module.exports = server;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

start();

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});
let users = [];

const addUser = (user, socketId) => {
  !users.find((current) => current.id === user.id) &&
    users.push({ ...user, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.id === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  //when connect

  //take userId and socketid from user
  socket.on("sendUser", (user) => {
    addUser(user, socket.id);
    io.emit("getUsers", users);
  });

  //send notification
  socket.on("sendNotification", (notification) => {
    let reciever = getUser(notification.reciever);

    if (reciever) {
      io.to(reciever.socketId).emit("getNotification", notification);
    }
  });

  //when disconenct
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  //take message from user
  socket.on("sendMessage", ({ sender, recieverId, text }) => {
    const reciver = getUser(recieverId);

    if (reciver) {
      io.to(reciver.socketId).emit("getMessage", {
        sender,
        text,
      });
    }
  });
});
