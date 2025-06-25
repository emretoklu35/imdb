// server/index.js

// --- GEREKLİ PAKETLERİ İÇE AKTARMA ---
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Rota ve Veritabanı yapılandırmalarını içe aktarma
const authRoutes = require("./routes/auth");
const sequelize = require("./config/database");
const User = require("./models/User"); // User modelini de burada import edelim, best practice.

// --- UYGULAMA YAPILANDIRMASI ---
dotenv.config();
const app = express();

// --- MIDDLEWARE'LER ---
// app.use() ile eklenen bu fonksiyonlar, her istek rotaya ulaşmadan önce çalışır.
app.use(cors()); // Farklı kaynaklardan (client) gelen isteklere izin verir.
app.use(express.json()); // Gelen isteklerin body'sini JSON olarak ayrıştırır.

// --- API ROTALARI ---
// Express, rotaları yukarıdan aşağıya doğru eşleştirir.
// "/api/auth" gibi daha spesifik rotaların, daha genel olanlardan önce gelmesi iyi bir pratiktir.

// Ana Rota (Test için)
app.get("/", (req, res) => {
  res.send("IMDb Clone Backend çalışıyor!");
});

// Film Rotaları
app.get("/api/movies/top-10", (req, res) => {
  const topMoviesData = [
    {
      rank: 1,
      title: "3 Body Problem",
      rating: 7.7,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/6eSotpQJ4C00iG5wD5n49i25iCf.jpg",
    },
    {
      rank: 2,
      title: "Shōgun",
      rating: 9.1,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdvI2IeP23f2t0TGOh.jpg",
    },
    {
      rank: 3,
      title: "Godzilla X Kong",
      rating: 6.6,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/v4I1p6Jv_2I3iA2b204S3i5lI2w.jpg",
    },
    {
      rank: 4,
      title: "The Gentlemen",
      rating: 8.2,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/n02J0pW2j2HGWACX626pIqT5KJE.jpg",
    },
    {
      rank: 5,
      title: "Road House",
      rating: 6.2,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/bA4GKlVgt9CaaU4nCV12MXrdpCg.jpg",
    },
    {
      rank: 6,
      title: "Dune: Part Two",
      rating: 8.8,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH25U91DbU.jpg",
    },
    {
      rank: 7,
      title: "Fallout",
      rating: 8.5,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/gO9k7t9iFGf22i5n7tIso2sXTk.jpg",
    },
    {
      rank: 8,
      title: "Ripley",
      rating: 8.1,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/3r135wLdfpT8Pa7n5K96h3eKOy5.jpg",
    },
    {
      rank: 9,
      title: "Poor Things",
      rating: 8.3,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/kCGlIMrg8PxbGhPa2rVjMEu2GKo.jpg",
    },
    {
      rank: 10,
      title: "Oppenheimer",
      rating: 8.6,
      posterUrl:
        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    },
  ];
  res.json(topMoviesData);
});

// Authentication Rotaları
// "/api/auth" ile başlayan tüm istekler 'authRoutes' dosyasına yönlendirilir.
app.use("/api/auth", authRoutes);

// --- VERİTABANI & SUNUCU BAŞLATMA ---
// Bu bölüm en sonda yer almalıdır.

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

// Modelleri veritabanı ile senkronize et
sequelize
  .sync()
  .then(() => {
    console.log("✅ Tablolar başarıyla senkronize edildi.");
  })
  .catch((error) => {
    console.error("❌ Tablolar senkronize edilirken bir hata oluştu:", error);
  });

// Sunucuyu dinlemeye başla
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});
