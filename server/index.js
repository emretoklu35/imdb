// Dosya Yolu: server/index.js (TAM VE GÜNCEL HALİ)

// --- GEREKLİ PAKETLERİ İÇE AKTARMA ---
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session"); // Oturum yönetimi için
const passport = require("passport"); // Kimlik doğrulama için

dotenv.config(); // .env dosyasındaki değişkenleri yükler

// --- ROTA VE YAPILANDIRMA DOSYALARINI İÇE AKTARMA ---
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
require("./config/passport-setup"); // Passport yapılandırmasını çalıştırır (ÖNEMLİ)

// --- VERİTABANI VE MODELLERİ MERKEZİ YERDEN İÇE AKTARMA ---
const { sequelize } = require("./database");

// --- UYGULAMA YAPILANDIRMASI ---

const app = express();

// --- MIDDLEWARE'LER ---
app.use(cors()); // Farklı portlardan gelen isteklere izin verir
app.use(express.json()); // Gelen JSON verilerini parse eder

// --- SESSION VE PASSPORT MIDDLEWARE'LERİ ---
// Not: Bu middleware'ler, API rotalarından önce tanımlanmalıdır.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "myimdbclonesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- API ROTALARI ---
app.get("/", (req, res) => {
  res.send("IMDb Clone Backend çalışıyor!");
});

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

// --- VERİTABANI & SUNUCU BAŞLATMA ---

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarıyla kuruldu.");
  } catch (error) {
    console.error("❌ Veritabanına bağlanılamadı:", error);
  }
};
testDbConnection();

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Tablolar ve ilişkiler başarıyla senkronize edildi.");
  })
  .catch((error) => {
    console.error("❌ Tablolar senkronize edilirken bir hata oluştu:", error);
  });

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});
