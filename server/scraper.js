// Dosya Yolu: server/scraper.js (PUPPETEER VERSİYONU)

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { Movie } = require("./database");

const URL = "https://www.imdb.com/chart/top/";

const scrapeAndSave = async () => {
  console.log("Puppeteer ile scraping işlemi başlıyor...");

  let browser = null;
  try {
    // 1. ADIM: Tarayıcıyı Başlat ve Sayfayı Aç
    browser = await puppeteer.launch({
      headless: true, // Arka planda çalışması için 'true'
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Bazı sistemlerde uyumluluk için
    });
    const page = await browser.newPage();

    // Bot olduğumuzu gizlemek için User-Agent ayarla
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Sayfaya git
    await page.goto(URL, { waitUntil: "networkidle2" }); // Ağ trafiği durana kadar bekle

    // 2. ADIM: "Lazy Loading" sorununu çözmek için sayfayı aşağı kaydır
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

    // 3. ADIM: Sayfanın HTML İçeriğini Al ve Analiz Et
    const content = await page.content();
    const $ = cheerio.load(content);

    const movieItems = $("li.ipc-metadata-list-summary-item");
    console.log(
      `${movieItems.length} adet film bulundu. Veritabanına kaydediliyor...`
    );

    if (movieItems.length < 200) {
      console.warn(
        "UYARI: 250'den az film bulundu. IMDB'nin yapısı değişmiş olabilir."
      );
    }

    const moviesToSave = [];

    // Önceki kodla aynı analiz mantığı
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

    // 4. ADIM: Veritabanına Kaydetme
    // Mevcut filmleri temizleyip yenilerini eklemek daha temiz bir başlangıç sağlar.
    console.log("Eski film verileri temizleniyor...");
    await Movie.destroy({ where: {}, cascade: true, truncate: true });

    console.log("Yeni film verileri veritabanına kaydediliyor...");
    await Movie.bulkCreate(moviesToSave);

    console.log(
      `✅ ${moviesToSave.length} adet film başarıyla veritabanına kaydedildi.`
    );
  } catch (error) {
    console.error("❌ Puppeteer scraping sırasında bir hata oluştu:", error);
  } finally {
    // Tarayıcıyı her zaman kapat
    if (browser) {
      await browser.close();
      console.log("Tarayıcı kapatıldı.");
    }
  }
};

if (require.main === module) {
  scrapeAndSave();
}

module.exports = scrapeAndSave;
