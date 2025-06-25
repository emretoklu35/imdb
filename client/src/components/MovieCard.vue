<!-- client/src/components/MovieCard.vue -->
<template>
  <div class="movie-card">
    <img :src="movie.posterUrl" :alt="movie.title" class="poster" />
    <div class="rating">
      <span>⭐</span>
      <span>{{ movie.rating }}</span>
    </div>
    <h3 class="title">{{ movie.rank }}. {{ movie.title }}</h3>
    <button class="watchlist-btn">+ Watchlist</button>
  </div>
</template>

<script setup lang="ts">
// 'defineProps' ile bu bileşenin dışarıdan 'movie' adında bir prop alacağını belirtiyoruz.
defineProps<{
  movie: {
    rank: number
    title: string
    rating: number
    posterUrl: string
  }
}>()
</script>

<style scoped>
.movie-card {
  width: 180px; /* Kart genişliği */
  background-color: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
}
.poster {
  width: 100%;
  height: 250px;
  object-fit: cover; /* Resmin orantısını bozmadan kaplamasını sağlar */
}
.rating {
  padding: 8px;
  font-weight: bold;
}
.title {
  padding: 0 8px;
  font-size: 16px;
  flex-grow: 1; /* Butonun en altta kalmasını sağlar */
}
.watchlist-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: #5799ef;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  font-weight: bold;
}
.watchlist-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
