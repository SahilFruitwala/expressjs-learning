const router = require("express").Router();

const productController = require('../controllers/products');


router.get("/add-product", productController.getAddProduct);

router.post("/add-product", productController.postAddProduct); 

module.exports = router;
