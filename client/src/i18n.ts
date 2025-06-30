// Dosya Yolu: client/src/i18n.js (İSTEĞİNİZE GÖRE GÜNCELLENMİŞ TAM KOD)

import { createI18n } from 'vue-i18n'

const messages = {
  // ======================
  // İNGİLİZCE ÇEVİRİLER
  // ======================
  en: {
    // Ana Sayfa Metinleri
    home: {
      // HomeView'de kullanılan anahtarın metnini değiştiriyoruz.
      // Mantık "Öne Çıkanları" gösterir, ama başlık "Top 10" yazar.
      featuredTitle: 'Top 10 on IMDb this week',
      loading: 'Loading Movies...',
    },

    // Navbar Metinleri
    navbar: {
      menu: 'Menu',
      searchPlaceholder: 'Search IMDb',
      watchlist: 'Watchlist',
      signIn: 'Sign In',
      welcome: 'Welcome, {name}',
      logout: 'Logout',
    },

    // Arama Kategorileri
    search_categories: {
      all: 'All',
      titles: 'Titles',
      episodes: 'TV Episodes',
      celebs: 'Celebs',
      companies: 'Companies',
    },

    // Slider Kartı Butonları
    slider_card: {
      inWatchlist: 'In Watchlist',
      addToWatchlist: 'Watchlist',
      trailer: 'Trailer',
    },

    // Film Başlıkları (seed.js dosyasından alındı)
    movie_titles: {
      'Squid Game': 'Squid Game',
      'F1: The Movie': 'F1: The Movie',
      'The Bear': 'The Bear',
      '28 Years Later': '28 Years Later',
      'The Waterfront': 'The Waterfront',
      Ironheart: 'Ironheart',
      Countdown: 'Countdown',
      'Dept. Q': 'Dept. Q',
      'We Were Liars': 'We Were Liars',
      'K-Pop: Demon Hunters': 'K-Pop: Demon Hunters',
    },
  },
  // ======================
  // TÜRKÇE ÇEVİRİLER
  // ======================
  tr: {
    // Ana Sayfa Metinleri
    home: {
      // HomeView'de kullanılan anahtarın metnini değiştiriyoruz.
      // Mantık "Öne Çıkanları" gösterir, ama başlık "Top 10" yazar.
      featuredTitle: 'Bu hafta IMDb Top 10',
      loading: 'Filmler Yükleniyor...',
    },

    // Navbar Metinleri
    navbar: {
      menu: 'Menü',
      searchPlaceholder: "IMDb'de Ara",
      watchlist: 'İzleme Listesi',
      signIn: 'Giriş Yap',
      welcome: 'Hoş geldin, {name}',
      logout: 'Çıkış Yap',
    },

    // Arama Kategorileri
    search_categories: {
      all: 'Tümü',
      titles: 'Başlıklar',
      episodes: 'TV Bölümleri',
      celebs: 'Ünlüler',
      companies: 'Şirketler',
    },

    // Slider Kartı Butonları
    slider_card: {
      inWatchlist: 'Listede',
      addToWatchlist: 'İzleme Listesi',
      trailer: 'Fragman',
    },

    // Film Başlıkları (seed.js dosyasından alındı)
    movie_titles: {
      'Squid Game': 'Kalamar Oyunu',
      'F1: The Movie': 'F1: Filmi',
      'The Bear': 'Ayı',
      '28 Years Later': '28 Yıl Sonra',
      'The Waterfront': 'Rıhtım',
      Ironheart: 'Demir Yürek',
      Countdown: 'Geri Sayım',
      'Dept. Q': 'Departman Q',
      'We Were Liars': 'Yalancılardık',
      'K-Pop: Demon Hunters': 'K-Pop: İblis Avcıları',
    },
  },
}

// Tarayıcı dilini algılama fonksiyonu
const getBrowserLocale = () => {
  const navigatorLocale = navigator.language ? navigator.language.split('-')[0] : 'en'
  return ['en', 'tr'].includes(navigatorLocale) ? navigatorLocale : 'en'
}

// i18n örneğini oluşturma
const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en', // Bir çeviri bulunamazsa İngilizce metni gösterir
  messages,
})

export default i18n
