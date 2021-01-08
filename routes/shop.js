const router = require("express").Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postDeleteCartItem);

router.post("/orders", shopController.postOrders);

router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
