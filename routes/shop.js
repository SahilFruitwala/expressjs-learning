const router = require("express").Router();
const path = require('path')
const rootDir = require('../utils/path')

router.get("/", (req, res, next) => {
  console.log("Default Middleware!");
  res.sendFile(path.join(rootDir, 'views', 'shop.html'))
});

module.exports = router;