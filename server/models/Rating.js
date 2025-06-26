// server/models/Rating.js
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
        min: 1, // Puan en az 1 olabilir
        max: 10, // Puan en fazla 10 olabilir
      },
    },
    comment: {
      type: DataTypes.TEXT, // Yorumlar uzun olabileceği için TEXT tipi daha uygun
      allowNull: true, // Yorum yapmak opsiyonel olabilir
    },
    // Hangi kullanıcının ve hangi filmin puanlandığını bilmemiz gerekiyor.
    // Bu alanlar Foreign Key (Yabancı Anahtar) olacak.
    // İlişkileri birazdan kuracağız.
    // userId: ...
    // movieId: ...
  },
  {
    tableName: "ratings",
  }
);

module.exports = Rating;
