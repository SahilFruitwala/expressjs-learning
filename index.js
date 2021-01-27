require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

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
  collection: 'sessions'
});

// ! ejs
app.set("view engine", "ejs");
app.set("views", "views"); // set location of views folder(2nd arg)

// body parser is now added into express as well
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret of my shop",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

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
app.use(authRoute);
app.use(errorController.get404);

mongoose
  .connect(URI)
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
