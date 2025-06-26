// server/index.js

// --- GEREKLİ PAKETLERİ İÇE AKTARMA ---
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// --- ROTA DOSYALARINI İÇE AKTARMA ---
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");

const { sequelize, User, Rating } = require("./database");

// --- UYGULAMA YAPILANDIRMASI ---
dotenv.config();
const app = express();

// --- MIDDLEWARE'LER ---
app.use(cors());
app.use(express.json());

// --- API ROTALARI ---
app.get("/", (req, res) => {
  res.send("IMDb Clone Backend çalışıyor!");
});

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

// --- VERİTABANI & SUNUCU BAŞLATMA ---

// Veritabanı bağlantısını test et
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarıyla kuruldu.");
  } catch (error) {
    console.error("❌ Veritabanına bağlanılamadı:", error);
  }
};
testDbConnection();

// Modelleri veritabanı ile senkronize et.
// { alter: true } seçeneği, mevcut veriyi kaybetmeden tablo yapısını günceller.
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Tablolar ve ilişkiler başarıyla senkronize edildi.");
  })
  .catch((error) => {
    console.error("❌ Tablolar senkronize edilirken bir hata oluştu:", error);
  });

// Sunucuyu dinlemeye başla
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});
