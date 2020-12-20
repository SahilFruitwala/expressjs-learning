const router = require("express").Router();

const getProducts = require("../controllers/products").getProducts;

router.get("/", getProducts);

module.exports = router;
