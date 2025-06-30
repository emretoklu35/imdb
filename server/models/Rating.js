const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ratings",
  }
);

module.exports = Rating;
