const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DBName,
  process.env.DBUser,
  process.env.DBPassword,
  {
    dialect: "mysql",
    host: process.env.DBHost,
  }
);

module.exports = sequelize;
