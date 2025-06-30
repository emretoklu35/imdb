// Dosya Yolu: server/routes/movies.js (TAM VE GÜNCEL HALİ)

const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { Movie, Rating, User, Actor, sequelize } = require("../database"); // sequelize'i import listesine ekliyoruz

const router = express.Router();

// --- YARDIMCI FONKSİYON: POPÜLERLİK SKORUNU GÜNCELLE ---
async function updatePopularity(movieId) {
  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) return;

    const score =
      movie.viewCount * 1 + movie.ratingCount * 50 + movie.rating * 10;

    movie.popularityScore = score;
    await movie.save();
    console.log(
      `'${movie.title}' filminin popülerlik skoru güncellendi: ${score}`
    );
  } catch (error) {
    console.error(
      `Popülerlik güncellenirken hata oluştu (Movie ID: ${movieId}):`,
      error
    );
  }
}

// --- API ROTASI: ÖNE ÇIKAN FİLMLERİ GETİR ---
router.get("/featured", async (req, res) => {
  try {
    const featuredMovies = await Movie.findAll({
      where: { isFeatured: true },
      order: [["popularityScore", "DESC"]],
    });
    res.json(featuredMovies);
  } catch (err) {
    console.error("Öne çıkan filmler getirilirken hata:", err);
    res.status(500).send("Sunucu Hatası");
  }
});

// --- API ROTASI: EN POPÜLER FİLMLERİ GETİR ---
router.get("/list/by-popularity", async (req, res) => {
  try {
    const popularMovies = await Movie.findAll({
      order: [["popularityScore", "DESC"]],
      limit: 20,
    });
    res.json(popularMovies);
  } catch (err) {
    console.error("Popüler filmler getirilirken hata:", err);
    res.status(500).send("Sunucu Hatası");
  }
});

// --- API ROTASI: TEK BİR FİLMİN DETAYLARINI GETİR ---
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: {
        model: Actor,
        attributes: ["id", "name", "imageUrl"],
        through: { attributes: [] },
      },
    });
    if (!movie) return res.status(404).json({ msg: "Film bulunamadı" });

    Movie.increment("viewCount", { where: { id: req.params.id } }).then(() =>
      updatePopularity(req.params.id)
    );

    res.json(movie);
  } catch (err) {
    console.error("Film detayı getirilirken hata:", err);
    res.status(500).send("Sunucu Hatası");
  }
});

// --- API ROTASI: BİR FİLME PUAN VER VEYA GÜNCELLE ---
router.post(
  "/:id/rate",
  [
    auth,
    [
      body("score").isInt({ min: 1, max: 10 }),
      body("comment").optional().isString(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const movieId = req.params.id;
    const userId = req.user.id;
    const { score, comment } = req.body;

    try {
      let [rating, created] = await Rating.findOrCreate({
        where: { userId, movieId },
        defaults: { score, comment },
      });

      if (!created) {
        rating.score = score;
        rating.comment = comment;
        await rating.save();
        updatePopularity(movieId);
        return res.json(rating);
      } else {
        Movie.increment("ratingCount", { where: { id: movieId } }).then(() =>
          updatePopularity(movieId)
        );
        return res.status(201).json(rating);
      }
    } catch (err) {
      console.error("Puanlama sırasında hata:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// --- API ROTASI: VİDEO ID'SİNE GÖRE FİLM BUL ---
router.get("/by-video/:videoId", async (req, res) => {
  try {
    const movie = await Movie.findOne({
      where: { videoId: req.params.videoId },
    });
    if (!movie)
      return res
        .status(404)
        .json({ msg: "Bu video ID'sine sahip film bulunamadı" });
    res.json(movie);
  } catch (err) {
    console.error("Video ID ile film aranırken hata:", err);
    res.status(500).send("Sunucu Hatası");
  }
});

// --- API ROTASI: BİR FİLMİN TÜM PUAN VE YORUMLARINI GETİR ---
router.get("/:id/ratings", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { movieId: req.params.id },
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "country"],
      },
    });
    res.json(ratings);
  } catch (err) {
    console.error("Film puanları getirilirken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// ===============================================
// === YENİ ROTA: PUAN ÖZETİ VE DAĞILIMINI GETİR ===
// ===============================================
router.get("/:id/ratings-summary", async (req, res) => {
  try {
    const movieId = req.params.id;

    // 1. Genel Puan Dağılımını Hesapla
    const scoreDistribution = await Rating.findAll({
      where: { movieId },
      attributes: [
        "score",
        [sequelize.fn("COUNT", sequelize.col("score")), "count"],
      ],
      group: ["score"],
      order: [["score", "ASC"]],
    });

    // 2. En Çok Oy Veren Ülkeleri Bul
    const topCountries = await Rating.findAll({
      where: { movieId },
      include: [{ model: User, attributes: [] }],
      attributes: [
        [sequelize.col("User.country"), "country"],
        [sequelize.fn("COUNT", sequelize.col("User.country")), "count"],
      ],
      group: ["User.country"],
      order: [[sequelize.fn("COUNT", sequelize.col("User.country")), "DESC"]],
      limit: 5,
    });

    // 3. Ülkelere Göre Puan Dağılımı
    const distributionByCountry = await Rating.findAll({
      where: { movieId },
      include: [{ model: User, attributes: [] }],
      attributes: [
        [sequelize.col("User.country"), "country"],
        "score",
        [sequelize.fn("COUNT", "score"), "count"],
      ],
      group: ["User.country", "score"],
      order: [
        [sequelize.col("User.country"), "ASC"],
        ["score", "ASC"],
      ],
    });

    res.json({
      scoreDistribution: scoreDistribution,
      topCountries: topCountries.map((c) => c.get({ plain: true })),
      distributionByCountry: distributionByCountry,
    });
  } catch (err) {
    console.error("Puan özeti getirilirken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
