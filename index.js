const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const xssClean = require("xss-clean");
const authRoutes = require("./routes/auth.route.js");
require("dotenv").config();
require("./config/passport")(passport);
const cloudinary = require("cloudinary").v2;
const path = require("path");

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use(helmet());
// app.use(morgan("dev"));
// app.use(xssClean());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  session({
    secret: "dawdadawdadawdwa2edqwfwgwreascdvthyjuk5uwtdsfdgtuk",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
