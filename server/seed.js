const { Movie, Actor, sequelize } = require("./database");

const FRONTEND_URL = "http://localhost:5173";

// Film verilerinin tam listesi
const manualMovies = [
  {
    title: "Squid Game",
    year: 2021,
    rating: 8.0,
    posterUrl: "/images/squid-game.jpg",
    summary:
      "A story of people who fail at life for various reasons, but suddenly receive a mysterious invitation to participate in a survival game to win more than 45 billion Won.",
    videoId: "oqxAJKy0ii4",
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
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
    isFeatured: true,
    trailerTitle: "Official Trailer",
    trailerSummary:
      "A world-renowned K-Pop girl group balance their lives in the spotlight with their secret identities as demon hunters.",
  },
];

const actorsData = [
  { name: "Lee Jung-jae", imageUrl: "/actors/lee-jung-jae.jpg" },
  { name: "Lee Byung-hun", imageUrl: "/actors/lee-byung-hun.jpg" },
  { name: "Brad Pitt", imageUrl: "/actors/brad-pitt.jpg" },
  { name: "Damson Idris", imageUrl: "/actors/damson-idris.jpg" },
  { name: "Jeremy Allen White", imageUrl: "/actors/jeremy-allen-white.jpg" },
  { name: "Ebon Moss-Bachrach", imageUrl: "/actors/ebon-moss-bachrach.jpg" },
  { name: "Jodie Comer", imageUrl: "/actors/jodie-comer.jpg" },
  {
    name: "Aaron Taylor-Johnson",
    imageUrl: "/actors/aaron-taylor-johnson.jpg",
  },
  { name: "Holt McCallany", imageUrl: "/actors/holt-mccallany.jpg" },
  { name: "Melissa Benoist", imageUrl: "/actors/melissa-benoist.jpg" },
  { name: "Dominique Thorne", imageUrl: "/actors/dominique-thorne.jpg" },
  { name: "Anthony Ramos", imageUrl: "/actors/anthony-ramos.jpg" },
  { name: "Jensen Ackles", imageUrl: "/actors/jensen-ackles.jpg" },
  { name: "Jessica Camacho", imageUrl: "/actors/jessica-camacho.jpg" },
  { name: "Matthew Goode", imageUrl: "/actors/matthew-goode.jpg" },
  { name: "Chloe Pirrie", imageUrl: "/actors/chloe-pirrie.jpg" },
  { name: "Emily Alyn Lind", imageUrl: "/actors/emily-alyn-lind.jpg" },
  { name: "Caitlin FitzGerald", imageUrl: "/actors/caitlin-fitzgerald.jpg" },
  { name: "Arden Cho", imageUrl: "/actors/arden-cho.jpg" },
  { name: "May Hong", imageUrl: "/actors/may-hong.jpg" },
];

const seedDatabase = async () => {
  try {
    await Movie.destroy({ where: {}, truncate: true, cascade: true });
    await Actor.destroy({ where: {}, truncate: true, cascade: true });
    console.log("Tablolar başarıyla temizlendi.");

    const actors = await Actor.bulkCreate(
      actorsData.map((actor) => ({
        ...actor,
        imageUrl: actor.imageUrl ? `${FRONTEND_URL}${actor.imageUrl}` : null,
      }))
    );
    console.log(`✅ ${actors.length} adet oyuncu başarıyla eklendi.`);

    const actorMap = actors.reduce((map, actor) => {
      map[actor.name] = actor;
      return map;
    }, {});

    console.log(
      "Filmler veritabanına ekleniyor ve oyuncularla ilişkilendiriliyor..."
    );
    for (const movieData of manualMovies) {
      const newMovie = await Movie.create({
        title: movieData.title,
        year: movieData.year,
        rating: movieData.rating,
        posterUrl: `${FRONTEND_URL}${movieData.posterUrl}`,
        videoId: movieData.videoId,
        summary: movieData.summary,
        trailerTitle: movieData.trailerTitle,
        trailerSummary: movieData.trailerSummary,
        isFeatured: movieData.isFeatured,
        rank: null,
      });

      switch (newMovie.title) {
        case "Squid Game":
          await newMovie.addActors([
            actorMap["Lee Jung-jae"],
            actorMap["Lee Byung-hun"],
          ]);
          break;
        case "F1: The Movie":
          await newMovie.addActors([
            actorMap["Brad Pitt"],
            actorMap["Damson Idris"],
          ]);
          break;
        case "The Bear":
          await newMovie.addActors([
            actorMap["Jeremy Allen White"],
            actorMap["Ebon Moss-Bachrach"],
          ]);
          break;
        case "28 Years Later":
          await newMovie.addActors([
            actorMap["Jodie Comer"],
            actorMap["Aaron Taylor-Johnson"],
          ]);
          break;
        case "The Waterfront":
          await newMovie.addActors([
            actorMap["Holt McCallany"],
            actorMap["Melissa Benoist"],
          ]);
          break;
        case "Ironheart":
          await newMovie.addActors([
            actorMap["Dominique Thorne"],
            actorMap["Anthony Ramos"],
          ]);
          break;
        case "Countdown":
          await newMovie.addActors([
            actorMap["Jensen Ackles"],
            actorMap["Jessica Camacho"],
          ]);
          break;
        case "Dept. Q":
          await newMovie.addActors([
            actorMap["Matthew Goode"],
            actorMap["Chloe Pirrie"],
          ]);
          break;
        case "We Were Liars":
          await newMovie.addActors([
            actorMap["Emily Alyn Lind"],
            actorMap["Caitlin FitzGerald"],
          ]);
          break;
        case "K-Pop: Demon Hunters":
          await newMovie.addActors([
            actorMap["Arden Cho"],
            actorMap["May Hong"],
          ]);
          break;
      }
    }
    console.log(
      `✅ ${manualMovies.length} adet film başarıyla eklendi ve oyuncular atandı.`
    );
  } catch (error) {
    console.error("❌ Veriler eklenirken bir hata oluştu:", error);
  } finally {
    await sequelize.close();
    console.log("Veritabanı bağlantısı kapatıldı.");
  }
};

seedDatabase();
