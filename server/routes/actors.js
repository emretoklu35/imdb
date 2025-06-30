// Dosya Yolu: server/routes/actors.js (YENİ DOSYA, TAM KOD)
const express = require("express");
const { Actor, Movie } = require("../database");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id, {
      include: {
        model: Movie,
        attributes: ["id", "title", "year", "posterUrl"],
        through: { attributes: [] },
      },
    });
    if (!actor) return res.status(404).json({ msg: "Oyuncu bulunamadı" });
    res.json(actor);
  } catch (err) {
    console.error("Oyuncu detayı getirilirken hata:", err);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
