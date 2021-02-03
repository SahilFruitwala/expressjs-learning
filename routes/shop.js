const router = require("express").Router();

const isAuth = require("../middleware/is-auth");

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postDeleteCartItem);

router.post("/create-order", isAuth, shopController.postOrders);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
