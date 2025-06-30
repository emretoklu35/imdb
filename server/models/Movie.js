// Dosya Yolu: server/models/Movie.js (FRAGMAN DETAYLI TAM KOD)

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Movie = sequelize.define(
  "Movie",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rank: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    posterUrl: { type: DataTypes.STRING(512), allowNull: false },
    summary: { type: DataTypes.TEXT, allowNull: true },
    videoId: { type: DataTypes.STRING(255), allowNull: true },

    // --- YENİ FRAGMAN BİLGİ ALANLARI ---
    trailerTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trailerSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ------------------------------------

    isTopTen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "movies",
    timestamps: true,
  }
);

module.exports = Movie;
