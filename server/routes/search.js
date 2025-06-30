// Dosya Yolu: server/routes/search.js (TAM VE GÜNCEL HALİ)

const express = require("express");
// Gerekli modelleri ve Sequelize'nin Op (Operatörler) nesnesini import ediyoruz
const { Movie, Actor } = require("../database");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Gelen arama sorgusunu al, başındaki/sonundaki boşlukları temizle.
    // Büyük/küçük harf duyarlılığını ortadan kaldırmak için sorguyu küçük harfe çevirmek iyi bir pratiktir,
    // ancak iLike zaten bunu yaptığı için şart değil. Yine de tutarlılık için kalabilir.
    const query = (req.query.q || "").trim();

    // Eğer sorgu boşsa, boş sonuç döndür ve işlemi bitir.
    if (!query) {
      return res.json({ titles: [], people: [] });
    }

    // Arama işlemlerini aynı anda (paralel olarak) başlatarak zaman kazanıyoruz.
    const [filteredMovies, filteredPeople] = await Promise.all([
      // 1. Film Arama Sorgusu
      Movie.findAll({
        where: {
          // Sequelize Op.or kullanarak "VEYA" koşulu oluşturuyoruz:
          // Başlıkta VEYA özette arama yap.
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } }, // Op.iLike: Büyük/küçük harfe duyarsız arama
            { summary: { [Op.iLike]: `%${query}%` } },
          ],
        },
        limit: 5, // Sonuç sayısını sınırlayarak performansı artırıyoruz.
      }),

      // 2. Oyuncu Arama Sorgusu
      Actor.findAll({
        where: {
          name: { [Op.iLike]: `%${query}%` }, // Oyuncu isminde arama yap.
        },
        limit: 5, // Sonuç sayısını sınırlıyoruz.
      }),
    ]);

    // Sonuçları tek bir JSON nesnesi içinde, ayrı anahtarlarla döndürüyoruz.
    res.json({
      titles: filteredMovies,
      people: filteredPeople, // Artık bu dizi, arama sonucuyla dolu olarak dönecektir.
    });
  } catch (err) {
    console.error("Arama sırasında hata:", err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
