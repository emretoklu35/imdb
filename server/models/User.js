// server/models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Veritabanı bağlantımızı import ediyoruz

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Bu alan boş bırakılamaz
      unique: true, // Her email benzersiz olmalı
      validate: {
        isEmail: true, // Geçerli bir email formatı olmalı
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Bu alan boş bırakılabilir (opsiyonel)
    },
    // Google ile giriş için Google'ın verdiği benzersiz ID'yi saklayabiliriz
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    tableName: "users", // Veritabanındaki tablo adını 'users' olarak belirliyoruz
  }
);

module.exports = User;
