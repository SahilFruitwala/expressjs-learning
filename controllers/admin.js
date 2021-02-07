const { validationResult } = require("express-validator/check");

const Product = require("../models/products");

exports.getProducts = (req, res, next) => {
  console.log("Products page of admin...");
  Product.find({ userId: req.user._id })
    .populate("userId")
    .then((products) => {
      console.log(products);
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
    hasError: false,
    errorMessage: null,
    validationError: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("Add Products(POST) page of admin...");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user._id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        imageUrl,
        description,
        price,
      },
      validationError: errors.array(),
    });
  }

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
        hasError: false,
        errorMessage: null,
        validationError: [],
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        _id: productId,
      },
      validationError: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() != req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("Delete Products(POST) page of admin...");
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
