require("dotenv").config();
const express = require("express");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");

const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

const PORT = process.env.PORT || 3000;
const app = express();

// ! ejs
app.set("view engine", "ejs");
app.set("views", "views"); // set location of views folder(2nd arg)

// body parser is now added into express as well
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5ffb862d4b754818fbed1f93")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use("/admin", adminRoute);
app.use(shopRoute);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT);
});
