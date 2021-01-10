require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const pass = process.env.MongoPassword;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://root:${pass}@express-learning.pgj2f.mongodb.net/test?retryWrites=true&w=majority`,
    { useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connection Succed!");
        callback(client);
      }
    }
  );
};

module.exports = mongoConnect;
