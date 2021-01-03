const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  console.log("Add Products(GET) page of admin...");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Add Products(POST) page of admin...");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

exports.getEditProduct = (req, res, next) => {
  console.log("Edit Products(GET) page of admin...");

  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  const productId = req.params.productId;
  Product.fetchById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  console.log("Edit Products(POST) page of admin...");
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );

  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("Delete Products(POST) page of admin...");
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of admin...");
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      products: products,
      path: "/admin/products",
    });
  });
};
