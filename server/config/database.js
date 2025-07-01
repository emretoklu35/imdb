const { Sequelize } = require("sequelize");
require("dotenv").config(); //

let sequelize;

console.log("Database URL:", process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, //
      },
    },
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "imdb_clone_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || null,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      port: process.env.DB_PORT || 5433,
      logging: false,
    }
  );
}

module.exports = sequelize;
