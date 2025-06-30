// Dosya Yolu: server/scraper.js (GÜNCELLENMİŞ VE DOĞRU HALİ)

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Movie } = require("./database");

const URL = "https://www.imdb.com/chart/top/";

const scrapeAndSave = async () => {
  console.log("Puppeteer ile scraping işlemi başlıyor...");

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(URL, { waitUntil: "networkidle2" });

    console.log("Tüm filmlerin yüklenmesi için sayfa aşağı kaydırılıyor...");
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const content = await page.content();
    const $ = cheerio.load(content);
    const movieItems = $("li.ipc-metadata-list-summary-item");
    console.log(`${movieItems.length} adet film bulundu. İşleniyor...`);

    const moviesToSave = [];
    movieItems.each((index, element) => {
      const titleElement = $(element).find("h3.ipc-title__text");
      const fullTitle = titleElement.text().trim();
      const [rankStr, ...titleParts] = fullTitle.split(". ");
      const rank = parseInt(rankStr);
      const title = titleParts.join(". ");

      const metadataElements = $(element).find(".cli-title-metadata-item");
      const year = parseInt($(metadataElements[0]).text().trim());

      const ratingElement = $(element).find("span.ipc-rating-star");
      const rating = parseFloat(ratingElement.text().trim().split(" ")[0]);

      // IMDb'den gelen URL zaten tam bir adres, ona dokunmuyoruz.
      const posterUrl = $(element).find("img.ipc-image").attr("src");

      if (!title || !year || !rating || !posterUrl) {
        return;
      }
      moviesToSave.push({
        rank,
        title,
        year,
        rating,
        posterUrl,
        summary: null,
      });
    });

    // ÖNEMLİ DEĞİŞİKLİK: Artık tüm veritabanını silmiyoruz!
    // Bunun yerine, her filmi kontrol edip ekleyeceğiz veya güncelleyeceğiz.
    console.log("IMDb Top 250 filmleri veritabanına kaydediliyor...");

    for (const movieData of moviesToSave) {
      await Movie.upsert(movieData);
    }

    console.log(
      `✅ ${moviesToSave.length} adet IMDb filmi başarıyla eklendi veya güncellendi.`
    );
  } catch (error) {
    console.error("❌ Puppeteer scraping sırasında bir hata oluştu:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Tarayıcı kapatıldı.");
    }
    // Veritabanı bağlantısını kapatmak için (isteğe bağlı)
    const { sequelize } = require("./database");
    await sequelize.close();
  }
};

if (require.main === module) {
  scrapeAndSave();
}

module.exports = scrapeAndSave;
