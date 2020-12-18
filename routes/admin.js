const router = require('express').Router();
const path = require("path");
const rootDir = require("../utils/path");

router.get("/add-prod", (req, res, next) => {
  console.log("In Add Product Middleware!");
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post("/add-prod", (req, res, next) => {
  console.log("In Show Product!");
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;