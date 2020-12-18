const path = require("path");
const router = require('express').Router();

router.get("/add-prod", (req, res, next) => {
  console.log("In Add Product Middleware!");
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

router.post("/add-prod", (req, res, next) => {
  console.log("In Show Product!");
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;