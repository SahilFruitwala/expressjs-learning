const router = require("express").Router();
const { body } = require("express-validator/check");

const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");


//  /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

//  /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 8 }).trim(),
  ],
  adminController.postAddProduct
);

//  /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

//  /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

//  /admin/edit-product => POST
router.post(
  "/edit-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 8 }).trim(),
  ],
  adminController.postEditProduct
);

//  /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
