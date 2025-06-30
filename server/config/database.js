const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("imdb_clone_db", "postgres", null, {
  host: "localhost",
  dialect: "postgres",
  port: 5433,
  logging: false,
});

module.exports = sequelize;
