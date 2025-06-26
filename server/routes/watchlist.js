// Dosya Yolu: server/routes/watchlist.js
const express = require("express");
const auth = require("../middleware/auth"); // İşlemler sadece giriş yapmış kullanıcılar için
const { User, Movie, Watchlist } = require("../database");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Movie,
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Kullanıcı bulunamadı" });
    }

    res.json(user.Movies || []);
  } catch (err) {
    console.error("İzleme listesi getirilirken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

router.post("/add", auth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  if (!movieId) {
    return res.status(400).json({ msg: "Film ID'si gereklidir." });
  }

  try {
    const [watchlistItem, created] = await Watchlist.findOrCreate({
      where: { userId, movieId },
      defaults: { userId, movieId },
    });

    if (created) {
      res
        .status(201)
        .json({ msg: "Film izleme listesine eklendi.", item: watchlistItem });
    } else {
      res
        .status(200)
        .json({ msg: "Bu film zaten izleme listenizde.", item: watchlistItem });
    }
  } catch (err) {
    console.error("Film eklenirken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

router.delete("/remove", auth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  if (!movieId) {
    return res.status(400).json({ msg: "Film ID'si gereklidir." });
  }

  try {
    const deleted = await Watchlist.destroy({
      where: { userId, movieId },
    });

    if (deleted) {
      res.status(200).json({ msg: "Film izleme listesinden kaldırıldı." });
    } else {
      res.status(404).json({ msg: "Film izleme listenizde bulunamadı." });
    }
  } catch (err) {
    console.error("Film kaldırılırken hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
