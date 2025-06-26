<!-- Dosya Yolu: client/src/views/WatchlistView.vue -->

<template>
  <div class="watchlist-page">
    <h1>My Watchlist</h1>

    <!-- İzleme listesi boşsa bir mesaj göster -->
    <div v-if="watchlist.length === 0" class="empty-list-message">
      <p>Your watchlist is empty.</p>
      <p>Click the '+ Watchlist' button on any movie to add it here.</p>
    </div>

    <!-- İzleme listesi doluysa filmleri bir grid yapısında göster -->
    <div v-else class="movie-grid">
      <MovieCard v-for="movie in watchlist" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MovieCard from '../components/MovieCard.vue' // MovieCard'ı burada da kullanıyoruz

// Auth store'u kullanıma al
const authStore = useAuthStore()

// Store'daki watchlist'i doğrudan kullanmak için bir computed property oluşturuyoruz.
const watchlist = computed(() => authStore.watchlist)
</script>

<style scoped>
.watchlist-page {
  padding: 20px;
}

h1 {
  color: #f5c518;
  margin-bottom: 30px;
}

.movie-grid {
  display: grid;
  /* Her sütunun en az 160px olmasını, boşluk varsa eşit dağılmasını sağlar */
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.empty-list-message {
  text-align: center;
  color: #888;
  padding: 50px;
  border: 2px dashed #333;
  border-radius: 8px;
}
</style>
