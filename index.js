require("dotenv").config();
const express = require("express");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");

const mongoConnect = require("./utils/database");

const PORT = process.env.PORT || 3000;
const app = express();

// ! ejs
app.set("view engine", "ejs");
app.set("views", "views"); // set location of views folder(2nd arg)

// body parser is now added into express as well
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use(shopRoute);
app.use("/admin", adminRoute);

app.use(errorController.get404);

mongoConnect((result) => {
  console.log(result);
  app.listen(PORT);
});
