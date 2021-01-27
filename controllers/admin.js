const Product = require("../models/products");

exports.getProducts = (req, res, next) => {
  console.log("Products page of admin...");
  Product.find()
    .populate("userId")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        pageTitle: "Admin Products",
        products: products,
        path: "/admin/products",
        isAuthenticated: req.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  console.log("Add Products(GET) page of admin...");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.isAuthenticated,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Add Products(POST) page of admin...");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user._id;

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  console.log("Edit Products(GET) page of admin...");

  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }

  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.isAuthenticated,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  console.log("Edit Products(POST) page of admin...");
  // const productId = new mongodb.ObjectId(req.body.productId);
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("Delete Products(POST) page of admin...");
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
