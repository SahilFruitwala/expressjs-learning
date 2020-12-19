const router = require("express").Router();
const path = require("path");

const rootDir = require("../utils/path");
const products = require("../routes/admin").products;

router.get("/", (req, res, next) => {
  console.log("Default Middleware!");
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
  res.render("shop", {
    docTitle: "Shop",
    products: products,
    path: "/",
    hasProducts: products.length > 0 ? true : false,
    productCSS: true
  });
});

module.exports = router;
