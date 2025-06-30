// Dosya Yolu: server/index.js (TAM KOD)
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

dotenv.config();

const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
const actorRoutes = require("./routes/actors"); // YENİ
require("./config/passport-setup");

const { sequelize } = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "myimdbclonesecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("IMDb Clone Backend çalışıyor!");
});

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/actors", actorRoutes); // YENİ

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
