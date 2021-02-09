const fs = require("fs");
const path = require("path");

const Product = require("../models/products");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  console.log("Index page of shop...");
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        products: products,
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error("Error in loading index page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of shop...");
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "All Products",
        products: products,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error("Error in loading Products page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(`Specific Product page of shop with id: ${productId}...`);
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error("Error in loading single product page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  console.log("Cart page of shop...");
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log(user.cart.items);
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        products: user.cart.items,
        path: "/cart",
      });
    })
    .catch((err) => {
      const error = new Error("Error in loading cart!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  console.log("Add to cart page of shop...");
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/products");
    })
    .catch((err) => {
      const error = new Error("Error in post cart!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  console.log("Delete cart item page of shop...");
  const productId = req.body.productId;
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Error in delete cart!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrders = (req, res, next) => {
  console.log("Checkout page of shop...");
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: { email: req.user.email, userId: req.user._id },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Error in ordering!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  console.log("Orders page of shop...");
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "My Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error("Error in loading order page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  console.log("Orders page of shop...");

  const orderId = req.params.orderId;
  const invoiceName = "Invoice-" + orderId + ".pdf";
  const invoicePath = path.join("data", "invoices", invoiceName);

  fs.readFile(invoicePath, (err, data) => {
    if(err) {
      return next(err);
    }
    res.send(data); 
  });
};
