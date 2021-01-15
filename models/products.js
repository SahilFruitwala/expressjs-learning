const mongodb = require("mongodb");

const getDb = require("../utils/database").getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    let temp_db;
    if (this._id) {
      console.log(this._id);
      temp_db = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      temp_db = db.collection("products").insertOne(this);
    }
    return temp_db
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("PRODUCTS: ", products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(productId) })
      .next()
      .then((product) => {
        console.log("PRODUCT: ", product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then(result => {
        console.log('DELETED!');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
