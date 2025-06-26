// Dosya Yolu: server/database.js (GÜNCELLENMİŞ HALİ)
const sequelize = require("./config/database");

// Modelleri import et
const User = require("./models/User");
const Movie = require("./models/Movie");
const Rating = require("./models/Rating");
const Watchlist = require("./models/Watchlist"); // YENİ: Watchlist modelini import ettik.

User.hasMany(Rating, { foreignKey: "userId", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "userId" });

Movie.hasMany(Rating, { foreignKey: "movieId", onDelete: "CASCADE" });
Rating.belongsTo(Movie, { foreignKey: "movieId" });

User.belongsToMany(Movie, { through: Watchlist, foreignKey: "userId" });
Movie.belongsToMany(User, { through: Watchlist, foreignKey: "movieId" });

const db = {
  sequelize,
  User,
  Movie,
  Rating,
  Watchlist,
};

module.exports = db;
