require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const pass = process.env.MongoPassword;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://toor:${pass}@express-learning.pgj2f.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    { useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("Connection Succed!");
        _db = client.db();
        callback(client);
      }
    }
  );
};

const getDb = () => {
  if(_db) {
    return _db
  }
  throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
