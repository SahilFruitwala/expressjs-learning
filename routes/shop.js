const path = require('path')
const router = require("express").Router();

router.get("/", (req, res, next) => {
  console.log("Default Middleware!");
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'))
});

module.exports = router;