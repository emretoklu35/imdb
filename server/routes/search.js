// Dosya Yolu: server/routes/search.js
const express = require("express");
const { Movie } = require("../database");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();

    if (!query) {
      return res.json({ titles: [], people: [] });
    }

    const filteredMovies = await Movie.findAll({
      where: {
        title: {
          [Op.iLike]: `%${query}%`,
        },
      },
      limit: 10,
    });

    const filteredPeople = [];

    res.json({
      titles: filteredMovies,
      people: filteredPeople,
    });
  } catch (err) {
    console.error("Arama sırasında hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
