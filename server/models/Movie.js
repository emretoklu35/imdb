// Dosya Yolu: server/models/Movie.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Movie = sequelize.define(
  "Movie",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true, // Her film Top 250'de olmayabilir, bu yüzden rank boş olabilir.
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    posterUrl: {
      type: DataTypes.STRING(512), // URL'ler uzun olabilir, varsayılandan biraz daha fazla yer ayıralım.
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT, // Özetler çok uzun olabilir, TEXT en uygunu.
      allowNull: true, // Her filmin özeti olmak zorunda değil.
    },
    // Projenin ilerleyen aşamalarında buraya yeni alanlar ekleyebiliriz.
    // Örn: trailerUrl: DataTypes.STRING,
  },
  {
    // Other model options go here
    tableName: "movies", // Veritabanındaki tablo adını 'movies' olarak net bir şekilde belirtiyoruz.
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler. Bu iyi bir pratiktir.
  }
);

module.exports = Movie;
