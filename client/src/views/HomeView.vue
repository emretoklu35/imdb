<!-- client/src/views/HomeView.vue -->

<template>
  <div class="home-view">
    <h1>Top 10 on IMDb this week</h1>
    <div class="movie-slider">
      <!-- 
        Bu v-for döngüsü, aşağıdaki script bölümündeki 'topMovies' listesindeki
        her bir film için bir 'MovieCard' bileşeni oluşturur.
        ':movie' prop'u ile her bir film verisini MovieCard bileşenine gönderir.
      -->
      <MovieCard v-for="movie in topMovies" :key="movie.rank" :movie="movie" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue'dan 'ref' ve 'onMounted' fonksiyonlarını import ediyoruz.
// ref: Değişkenleri reaktif hale getirmek için.
// onMounted: Bileşen yüklendiğinde kod çalıştırmak için.
import { ref, onMounted } from 'vue'

// Kendi oluşturduğumuz MovieCard bileşenini import ediyoruz.
import MovieCard from '../components/MovieCard.vue'

// Gelen film verisinin yapısını tanımlayan bir TypeScript interface'i oluşturalım.
// Bu, kodumuzun daha güvenli ve okunabilir olmasını sağlar.
interface Movie {
  rank: number
  title: string
  rating: number
  posterUrl: string
}

// 'topMovies' adında reaktif bir değişken oluşturuyoruz.
// Başlangıçta bu bir boş dizidir, çünkü veriler API'den gelecek.
// TypeScript'e bu değişkenin bir Movie dizisi olacağını söylüyoruz: "ref<Movie[]>([])"
const topMovies = ref<Movie[]>([])

// onMounted, bu bileşen ekrana ilk yüklendiği anda sadece bir kez çalışır.
// Bu yüzden API'den veri çekmek için en doğru yerdir.
onMounted(async () => {
  try {
    // 'fetch' fonksiyonu ile backend'deki API endpoint'imize bir GET isteği gönderiyoruz.
    const response = await fetch('http://localhost:9090/api/movies/top-10')

    // Eğer istek başarısız olursa (örn: sunucu kapalıysa veya 404 hatası verirse) bir hata fırlatıyoruz.
    if (!response.ok) {
      throw new Error('API isteği başarısız oldu.')
    }

    // Gelen cevabı JSON formatına çeviriyoruz.
    const data: Movie[] = await response.json()

    // API'den gelen veriyi 'topMovies' değişkenimize atıyoruz.
    // .value kullanmamızın sebebi 'topMovies'in bir 'ref' olmasıdır.
    topMovies.value = data
  } catch (error) {
    // try bloğu içinde bir hata oluşursa, catch bloğu çalışır.
    // Hatayı konsola yazdırarak sorunu anlamamızı sağlar.
    console.error('Filmleri çekerken bir hata oluştu:', error)
  }
})
</script>

<style scoped>
/* Bu stiller sadece bu bileşen (HomeView.vue) için geçerlidir. */

.movie-slider {
  display: flex;
  gap: 15px; /* Kartlar arasındaki boşluk */
  overflow-x: auto; /* İçerik sığmazsa yatayda bir kaydırma çubuğu gösterir */
  padding-bottom: 15px; /* Kaydırma çubuğunun içerikle bitişik olmaması için */
}

/* Kaydırma çubuğunu (scrollbar) daha estetik hale getirelim (sadece webkit tabanlı tarayıcılar için) */
.movie-slider::-webkit-scrollbar {
  height: 8px;
}

.movie-slider::-webkit-scrollbar-track {
  background: #2c2c2c;
  border-radius: 4px;
}

.movie-slider::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.movie-slider::-webkit-scrollbar-thumb:hover {
  background: #f5c518; /* IMDb sarısı */
}
</style>
