const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Watchlist = sequelize.define(
  "Watchlist",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: "movies",
        key: "id",
      },
      primaryKey: true,
    },
  },
  {
    tableName: "watchlists",
    timestamps: true,
  }
);

module.exports = Watchlist;
