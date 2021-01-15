const Product = require("../models/products");

exports.getProducts = (req, res, next) => {
  console.log("Products page of admin...");
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        products: products,
        path: "/admin/products",
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
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Add Products(POST) page of admin...");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );
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

  const product = new Product(title, price, imageUrl, description, productId);
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("Delete Products(POST) page of admin...");
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
