<!-- Dosya Yolu: client/src/components/MovieCard.vue (GÜNCELLENMİŞ HALİ) -->

<template>
  <div class="movie-card">
    <!-- Filme tıklandığında detay sayfasına gitmesi için router-link ile sarmalıyoruz -->
    <router-link :to="{ name: 'movie-detail', params: { id: movie.id } }">
      <img :src="movie.posterUrl" :alt="movie.title" class="poster" />
    </router-link>

    <div class="info-wrapper">
      <div class="rating">
        <span class="star">★</span>
        <span>{{ movie.rating }}</span>
      </div>
      <h3 class="title">{{ movie.title }}</h3>
    </div>

    <!-- YENİ ve AKILLI BUTON -->
    <!-- 
      - Butonun class'ını dinamik olarak belirliyoruz: film listedeyse 'in-watchlist' class'ı eklenir.
      - Butonun metnini de dinamik olarak değiştiriyoruz.
      - @click olayı, handleWatchlistClick fonksiyonunu çağırır.
    -->
    <button
      class="watchlist-btn"
      :class="{ 'in-watchlist': isMovieInWatchlist }"
      @click="handleWatchlistClick"
    >
      {{ isMovieInWatchlist ? '✓ In Watchlist' : '+ Watchlist' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Gelen 'movie' prop'unun yapısını tanımlıyoruz. ID'yi de ekliyoruz.
const props = defineProps<{
  movie: {
    id: number
    rank?: number // rank opsiyonel olabilir
    title: string
    rating: number
    posterUrl: string
  }
}>()

// Gerekli olan store ve router'ı kullanıma alıyoruz.
const authStore = useAuthStore()
const router = useRouter()

// Bu karttaki filmin izleme listesinde olup olmadığını kontrol eden bir 'computed property'.
// authStore.isInWatchlist getter'ını kullanır. Bu reaktif olduğu için,
// izleme listesi değiştiğinde bu değer de otomatik olarak güncellenir.
const isMovieInWatchlist = computed(() => {
  return authStore.isInWatchlist(props.movie.id)
})

// Butona tıklandığında çalışacak olan ana fonksiyon.
const handleWatchlistClick = () => {
  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return // Fonksiyonun devam etmesini engelle.
  }

  // Eğer film zaten listedeyse, çıkar.
  if (isMovieInWatchlist.value) {
    authStore.removeFromWatchlist(props.movie.id)
  }
  // Eğer film listede değilse, ekle.
  else {
    authStore.addToWatchlist(props.movie.id)
  }
}
</script>

<style scoped>
.movie-card {
  width: 160px;
  background-color: #1a1a1a;
  color: white;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Postere tıklandığında altındaki mavi çizgiyi kaldırmak için */
a {
  text-decoration: none;
  color: inherit;
}

.poster {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: opacity 0.2s;
}

.poster:hover {
  opacity: 0.8;
}

.info-wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}

.rating {
  font-weight: bold;
}

.star {
  color: #f5c518;
  margin-right: 4px;
}

.title {
  font-size: 16px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.watchlist-btn {
  background-color: #2c2c2c;
  color: #5799ef; /* IMDb'nin mavi link rengi */
  border: 1px solid #555;
  border-radius: 4px;
  padding: 10px;
  margin: 0 10px 10px 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.watchlist-btn:hover {
  background-color: #3f3f3f;
}

/* YENİ STİL: Buton 'in-watchlist' class'ına sahip olduğunda uygulanacak stil. */
.watchlist-btn.in-watchlist {
  background-color: #4caf50; /* Yeşil renk */
  color: white; /* Beyaz yazı */
  border-color: #4caf50;
}
</style>
