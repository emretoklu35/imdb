// Dosya Yolu: server/database.js (TAM VE GÜNCEL HALİ)

const sequelize = require("./config/database");

const User = require("./models/User");
const Movie = require("./models/Movie");
const Rating = require("./models/Rating");
const Watchlist = require("./models/Watchlist");
const Actor = require("./models/Actor"); // Yeni Actor modelini import ettik

User.hasMany(Rating, { foreignKey: "userId", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "userId" });

Movie.hasMany(Rating, { foreignKey: "movieId", onDelete: "CASCADE" });

Rating.belongsTo(Movie, { foreignKey: "movieId" });

User.belongsToMany(Movie, { through: Watchlist, foreignKey: "userId" });
Movie.belongsToMany(User, { through: Watchlist, foreignKey: "movieId" });

Movie.belongsToMany(Actor, { through: "MovieActors", timestamps: false });
Actor.belongsToMany(Movie, { through: "MovieActors", timestamps: false });

const db = {
  sequelize,
  User,
  Movie,
  Rating,
  Watchlist,
  Actor,
};

module.exports = db;
