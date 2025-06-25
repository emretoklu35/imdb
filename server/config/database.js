// server/config/database.js

// Gerekli olan Sequelize kütüphanesini import ediyoruz.
const { Sequelize } = require("sequelize");

// Projemizin veritabanına nasıl bağlanacağını anlatan bir nesne oluşturuyoruz.
const sequelize = new Sequelize(
  "imdb_clone_db", // 1. Veritabanı Adı: Az önce TablePlus'ta oluşturduğumuz veritabanı.
  "postgres", // 2. Kullanıcı Adı: DBngin'in varsayılan kullanıcısı.
  null, // 3. Şifre: DBngin şifre kullanmadığı için 'null' yazıyoruz.
  {
    host: "localhost", // 4. Sunucu Adresi: Veritabanı kendi bilgisayarımızda.
    dialect: "postgres", // 5. Veritabanı Türü: PostgreSQL kullanıyoruz.
    port: 5433, // 6. Port Numarası: DBngin'de '5432' dolu olduğu için bunu seçmiştik.
    logging: false, // Bu, konsolu temiz tutmak için SQL sorgularını gizler.
  }
);

// Bu 'sequelize' nesnesini, projenin başka yerlerinde de kullanabilmek için export ediyoruz.
module.exports = sequelize;
