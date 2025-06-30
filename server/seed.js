// Dosya Yolu: server/seed.js

const { Movie, sequelize } = require("./database");

const FRONTEND_URL = "http://localhost:5173";

// Gönderdiğin film verilerinin tamamı burada
const manualMovies = [
  {
    title: "Squid Game",
    year: 2021,
    rating: 8.0,
    posterUrl: "/images/squid-game.jpg",
    summary:
      "A story of people who fail at life for various reasons, but suddenly receive a mysterious invitation to participate in a survival game to win more than 45 billion Won.",
    videoId: "oqxAJKy0ii4",
    isTopTen: true,
    trailerTitle: "Season 3 | Final Games Trailer",
    trailerSummary:
      "The third and final season of Squid Game follows Gi-hun after losing his best friend in the game and being driven to utter despair by The Front Man, who was hiding his true identity to infiltrate the game. Gi-hun persists with his goal to put an end to the game, while the Front Man continues onto his next move and the surviving players' choices will lead to graver consequences with each round.",
  },
  {
    title: "F1: The Movie",
    year: 2025,
    rating: 7.9,
    posterUrl: "/images/f1-the-movie.jpg",
    summary: "A former Formula 1 driver returns to the sport.",
    videoId: "8yh9BPUBbbQ",
    isTopTen: true,
    trailerTitle: "Official Trailer",
    trailerSummary:
      "A Formula One driver comes out of retirement to mentor and team with a younger driver.",
  },
  {
    title: "The Bear",
    year: 2022,
    rating: 8.5,
    posterUrl: "/images/the-bear.jpg",
    summary:
      "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    videoId: "vOyRo-Yjr2Q",
    isTopTen: true,
    trailerTitle: "Official Teaser - Season 4",
    trailerSummary:
      "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
  },
  {
    title: "28 Years Later",
    year: 2025,
    rating: 7.2,
    posterUrl: "/images/28-years-later.jpg",
    summary:
      "A sequel to '28 Weeks Later' and the third installment in the '28 Days Later' series.",
    videoId: "mcvLKldPM08",
    isTopTen: true,
    trailerTitle: "Buy Tickets",
    trailerSummary:
      "It's been almost three decades since the rage virus escaped a biological weapons laboratory, and now, still in a ruthlessly enforced quarantine, some have found ways to exist amidst the infected. One such group of survivors lives on a small island connected to the mainland by a single, heavily-defended causeway. When one of the group leaves the island on a mission into the dark heart of the mainland, he discovers secrets, wonders, and horrors that have mutated not only the infected but other survivors as well.",
  },
  {
    title: "The Waterfront",
    year: 2024,
    rating: 6.9,
    posterUrl: "/images/the-waterfront.jpg",
    summary:
      "An ex-prize fighter turned longshoreman struggles to stand up to his corrupt union bosses.",
    videoId: "vE-oYo1hIEs",
    isTopTen: true,
    trailerTitle: "Original Trailer",
    trailerSummary:
      "As their storied North Carolina fishing empire decays, the damaged Buckleys grapple to revive their imperiled maritime heritage.",
  },
  {
    title: "Ironheart",
    year: 2025,
    rating: 3.6,
    posterUrl: "/images/ironheart.jpg",
    summary:
      "A brilliant teenage inventor named Riri Williams creates the most advanced suit of armor since Iron Man.",
    videoId: "r6j-wSIqJJ0",
    isTopTen: true,
    trailerTitle: "Ironheart: Official Trailer",
    trailerSummary: "Ironheart: Official Trailer",
  },
  {
    title: "Countdown",
    year: 2024,
    rating: 7.0,
    posterUrl: "/images/countdown.jpg",
    summary:
      "When a nurse downloads an app that claims to predict the moment a person will die, it tells her she only has three days to live.",
    videoId: "t72R6wZ0zQ8",
    isTopTen: true,
    trailerTitle: "Countdown (Australia)",
    trailerSummary: "Countdown (Australia)",
  },
  {
    title: "Dept. Q",
    year: 2024,
    rating: 8.2,
    posterUrl: "/images/dept-q.jpg",
    summary:
      "The film follows detective Carl Mørck, head of Department Q, who is assigned to the cold cases, and his assistant, Assad.",
    videoId: "72hK6FUmm8o",
    isTopTen: true,
    trailerTitle: "Dept. Q",
    trailerSummary: "Dept. Q",
  },
  {
    title: "We Were Liars",
    year: 2024,
    rating: 6.9,
    posterUrl: "/images/we-were-liars.jpg",
    summary:
      "A beautiful and distinguished family. A private island. A brilliant, damaged girl; a passionate, political boy. A group of four friends whose friendship turns destructive.",
    videoId: "uoMLuX42pCk",
    isTopTen: true,
    trailerTitle: "We Were Liars (Canada)",
    trailerSummary: "We Were Liars (Canada)",
  },
  {
    title: "K-Pop: Demon Hunters",
    year: 2025,
    rating: 6.8,
    posterUrl: "/images/kpop-demon-hunters.jpg",
    summary:
      "A world-renowned K-Pop group balances their lives as music stars with their secret identities as demon hunters.",
    videoId: "AzCAwdp1uIQ",
    isTopTen: true,
    trailerTitle: "Official Trailer",
    trailerSummary:
      "A world-renowned K-Pop girl group balance their lives in the spotlight with their secret identities as demon hunters.",
  },
];

// 'if (require.main === module)' yapısını kaldırıp, fonksiyonu doğrudan export ediyoruz.
// Bu, başka dosyalardan çağrılmasını kolaylaştırır ama bu proje için şart değil.
const seedDatabase = async () => {
  // try-catch-finally bloğu, hataları yakalamak ve bağlantıyı her zaman kapatmak için en iyi yoldur.
  try {
    console.log("Eski film verileri temizleniyor...");
    await Movie.destroy({ where: {}, truncate: true, cascade: true });
    console.log("Tablo başarıyla temizlendi.");

    console.log("Yeni filmler veritabanına ekleniyor...");
    // Senin istediğin gibi, for...of döngüsüyle tek tek ekleme
    for (const movieData of manualMovies) {
      await Movie.create({
        title: movieData.title,
        year: movieData.year,
        rating: movieData.rating,
        posterUrl: `${FRONTEND_URL}${movieData.posterUrl}`,
        videoId: movieData.videoId || null,
        summary: movieData.summary || null,
        trailerTitle: movieData.trailerTitle || null,
        trailerSummary: movieData.trailerSummary || null,
        isTopTen: movieData.isTopTen === true,
        rank: null,
      });
    }

    console.log(`✅ ${manualMovies.length} adet film başarıyla eklendi.`);
  } catch (error) {
    console.error("❌ Filmler eklenirken bir hata oluştu:", error);
  } finally {
    // Tüm işlemler bittikten veya hata alındıktan sonra bağlantıyı kapat.
    // Bu, script'in takılıp kalmasını önler.
    await sequelize.close();
    console.log("Veritabanı bağlantısı kapatıldı.");
  }
};

// Script'in doğrudan terminalden çalıştırılmasını sağlayan kontrol.
seedDatabase();
