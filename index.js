require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const errorController = require("./controllers/error");

const User = require("./models/user");

const PORT = process.env.PORT || 3000;
const PASS = process.env.MongoPassword;
const URI = `mongodb+srv://toor:${PASS}@express-learning.pgj2f.mongodb.net/ecommerce?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ! ejs
app.set("view engine", "ejs");
app.set("views", "views"); // set location of views folder(2nd arg)

// body parser is now added into express as well
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   multer({
//     dest: "images",
//   }).single("image")
// );
app.use(upload.single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "secret of my shop",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.use("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("errors/500", {
    pageTitle: "Error!",
    path: "/500",
  });
  // res.redirect("/500");
});

mongoose
  .connect(URI)
  .then((result) => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
