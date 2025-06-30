// Dosya Yolu: server/models/Actor.js (TAM KOD)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Actor = sequelize.define(
  "Actor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  },
  {
    tableName: "actors",
    timestamps: false,
  }
);

module.exports = Actor;
