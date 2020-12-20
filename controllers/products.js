const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  console.log("In getAddProduct...");
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("In postAddProduct...");
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  console.log("Default getProducts...");
  Product.fetchAll((products) => {
    res.render("shop", {
      docTitle: "Shop",
      products: products,
      path: "/",
      hasProducts: products.length > 0 ? true : false,
      productCSS: true,
    })
  })
};