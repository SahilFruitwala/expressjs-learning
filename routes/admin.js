const router = require("express").Router();
const path = require("path");

const rootDir = require("../utils/path");
const products = [];

router.get("/add-product", (req, res, next) => {
  console.log("In Add Product Middleware!");
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true
  });
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log("In Show Product!");
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
