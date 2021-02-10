const { validationResult } = require("express-validator/check");

const fileHelper = require("../utils/file");

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
    .catch((err) => {
      const error = new Error("Error while loading Add Product page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  const image = req.file;
  const imageUrl = req.file.path;
  const description = req.body.description;
  const price = req.body.price;
  const userId = req.user._id;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: "Attached file is not an image.",
      product: {
        title,
        description,
        price,
      },
      validationError: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
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
      const error = new Error("Creating product Failed!\n", err);
      error.httpStatusCode = 500;
      return next(error);
      // return res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   errorMessage: 'Database operation failed!',
      //   product: {
      //     title,
      //     imageUrl,
      //     description,
      //     price,
      //   },
      //   validationError: [],
      // });
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
    .catch((err) => {
      const error = new Error("Error while loading Edit Product page!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  console.log("Edit Products(POST) page of admin...");
  // const productId = new mongodb.ObjectId(req.body.productId);
  const productId = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const imageUrl = req.file.path;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: "Attached file is not an image.",
      product: {
        title,
        description,
        price,
      },
      validationError: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
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
      product.price = price;
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = imageUrl;
      }
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error("Editing product failed!\n", err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  console.log("Delete Products(POST) page of admin...");

  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((result) => {
      res.status(200).json({
        message: "Success!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        message: "Failed!",
      });
    });
};
