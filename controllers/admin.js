const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  console.log("Add Products(GET) page of admin...");
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Add Products(POST) page of admin...");
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of admin...");
  Product.fetchAll((products) => {
    res.render("admin/products", {
      docTitle: "Admin Products",
      products: products,
      path: "/admin/products",
    });
  });
};