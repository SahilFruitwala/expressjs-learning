const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  console.log("Index page of shop...");
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop",
        products: products,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of shop...");
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "All Products",
        products: products,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(`Specific Product page of shop with id: ${productId}...`);
  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  console.log("Cart page of shop...");
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartProducts) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        products: cartProducts,
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  console.log("Add to cart page of shop...");
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  console.log("Delete cart item page of shop...");
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      
    })
    .catch((err) => console.log(err));
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
