const Product = require("../models/products");

exports.getIndex = (req, res, next) => {
  console.log("Index page of shop...");
  Product.fetchAll((products) => {
    res.render("shop/index", {
      docTitle: "Shop",
      products: products,
      path: "/"
    });
  });
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of shop...");
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      docTitle: "All Products",
      products: products,
      path: "/products"
    });
  });
};

exports.getCart = (req, res, next) => {
  console.log("Cart page of shop...");
  res.render("shop/cart", {
    docTitle: "Cart",
    path: '/cart'
  });
};

exports.getCheckout = (req, res, next) => {
  console.log("Checkout page of shop...");
    res.render("shop/checkout", {
      docTitle: "Checkout",
      path: "/checkout",
    });
};

exports.getOrders = (req, res, next) => {
  console.log("Orders page of shop...");
    res.render("shop/orders", {
      docTitle: "My Orders",
      path: "/orders",
    });
};
