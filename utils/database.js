const mysql = require('mysql2');
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DBHost,
  user: process.env.DBUser,
  password: process.env.DBPassword,
  database: process.env.DBName,
});

module.exports = pool.promise();