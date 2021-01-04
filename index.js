require("dotenv").config();
const express = require("express");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./utils/database");

const Product = require("./models/products");
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

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use(shopRoute);
app.use("/admin", adminRoute);

app.use(errorController.get404);

Product.belongsTo(User, { Constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync({ force: true }) // for dev only
  .then((result) => {
    // console.log(result);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
