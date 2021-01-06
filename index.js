require("dotenv").config();
const express = require("express");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./utils/database");

const Product = require("./models/products");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

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
  User.findByPk(1)
    .then((user) => {
      req.user = user; // here, user is sequelize object.
      next();
    })
    .catch((err) => console.log(err));
});

// use match with any url pattern
// whereas get, post and others match exact pattern
app.use(shopRoute);
app.use("/admin", adminRoute);

app.use(errorController.get404);

Product.belongsTo(User, { Constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync({ force: true }) // for dev only
  // .sync() // for dev only
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "John", email: "john@email.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
