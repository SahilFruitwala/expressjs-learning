const router = require("express").Router();
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const User = require("../models/user");

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User with email already exist!");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter password with only number and text and at least 5 characters!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password did not match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Enter valid email or password!!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Enter valid email or password!!");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter valid password!")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
