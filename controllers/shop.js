const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  console.log("Index page of shop...");
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        pageTitle: "Shop",
        products: rows,
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  console.log("Products page of shop...");
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        pageTitle: "All Products",
        products: rows,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(`Specific Product page of shop with id: ${productId}...`);
  Product.fetchById(productId)
  .then(([product]) => {
    console.log(product[0].title);
    res.render("shop/product-detail", {
      pageTitle: product.title,
      product: product[0],
      path: "/products",
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  console.log("Cart page of shop...");
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const existingProduct = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (existingProduct) {
          cartProducts.push({ product: product, qty: existingProduct.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        products: cartProducts,
        path: "/cart",
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  console.log("Add to cart page of shop...");
  const productId = req.body.productId;
  Product.fetchById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteCartItem = (req, res, next) => {
  console.log("Delete cart item page of shop...");
  const productId = req.body.productId;
  Product.fetchById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
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
