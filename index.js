require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");

const User = require("./models/user");

const PORT = process.env.PORT || 3000;
const PASS = process.env.MongoPassword;
const app = express();

// ! ejs
app.set("view engine", "ejs");
app.set("views", "views"); // set location of views folder(2nd arg)

// body parser is now added into express as well
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6008a0647c2efe342c510643")
    .then((user) => {
      req.user = user;
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

mongoose
  .connect(
    `mongodb+srv://toor:${PASS}@express-learning.pgj2f.mongodb.net/ecommerce?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "John Doe",
          email: "john.doe@email.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
