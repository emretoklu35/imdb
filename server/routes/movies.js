// Dosya Yolu: server/routes/movies.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
// Veritabanı dosyasından gerekli olan Movie ve Rating modellerini import ediyoruz.
const { Movie, Rating } = require("../database");

const router = express.Router();

// --- API ROTASI: TOP 10 FİLMİ GETİR ---

router.get("/top-10", async (req, res) => {
  try {
    const topMovies = await Movie.findAll({
      order: [["rating", "DESC"]], //
      limit: 10,
    });
    res.json(topMovies);
  } catch (err) {
    console.error("Top 10 filmleri getirilirken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ msg: "Film bulunamadı" });
    }

    res.json(movie);
  } catch (err) {
    console.error(
      `Film (ID: ${req.params.id}) getirilirken hata:`,
      err.message
    );
    res.status(500).send("Sunucu Hatası");
  }
});

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

module.exports = router;
