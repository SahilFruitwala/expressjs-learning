const Product = require("../models/products");
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  console.log("Index page of shop...");
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      products: products,
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of shop...");
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "All Products",
      products: products,
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(`Specific Product page of shop with id: ${productId}...`);
  Product.fetchById(productId, (product) => {
    res.render("shop/product-detail", {
      pageTitle: product.title,
      product: product,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  console.log("Cart page of shop...");
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  console.log("Add to cart page of shop...");
  const productId = req.body.productId;
  Product.fetchById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  })
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  console.log("Checkout page of shop...");
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  console.log("Orders page of shop...");
  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
  });
};
