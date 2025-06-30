// Dosya Yolu: server/routes/movies.js

const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { Movie, Rating } = require("../database");

const router = express.Router();

// --- API ROTASI: TOP 10 FİLMİ GETİR ---
router.get("/top-10", async (req, res) => {
  try {
    const topMovies = await Movie.findAll({
      where: { isTopTen: true },
      limit: 10,
    });
    res.json(topMovies);
  } catch (err) {
    res.status(500).send("Sunucu Hatası");
  }
});

// --- API ROTASI: TEK BİR FİLMİN DETAYLARINI GETİR ---
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Film bulunamadı" });
    res.json(movie);
  } catch (err) {
    res.status(500).send("Sunucu Hatası");
  }
});

// ==================== HATA BURADAYDI, ŞİMDİ DÜZELTİLDİ ====================
// --- API ROTASI: BİR FİLME PUAN VER VEYA GÜNCELLE ---
router.post(
  "/:id/rate",
  [
    auth,
    [
      body("score", "Puan 1 ile 10 arasında bir tam sayı olmalıdır.").isInt({
        min: 1,
        max: 10,
      }),
      body("comment", "Yorum bir metin olmalıdır.").optional().isString(),
    ],
  ],
  // BU FONKSİYON EKSİKTİ, ŞİMDİ EKLENDİ
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const movieId = req.params.id;
      const userId = req.user.id;
      const { score, comment } = req.body;

      let existingRating = await Rating.findOne({ where: { userId, movieId } });

      if (existingRating) {
        existingRating.score = score;
        existingRating.comment = comment || existingRating.comment;
        await existingRating.save();
        return res.json(existingRating);
      } else {
        const newRating = await Rating.create({
          score,
          comment,
          userId,
          movieId,
        });
        return res.status(201).json(newRating);
      }
    } catch (err) {
      console.error("Puanlama sırasında hata:", err.message);
      res.status(500).send("Server Error");
    }
  }
);
// =======================================================================

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
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
