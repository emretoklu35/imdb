<!-- client/src/views/MovieDetailView.vue -->
<template>
  <div v-if="loading" class="loading-state">Loading...</div>
  <div v-if="error" class="error-state">{{ error }}</div>

  <div v-if="movie" class="movie-detail-page">
    <div class="main-content">
      <div class="poster-container">
        <img :src="movie.posterUrl" :alt="movie.title" class="poster-image" />
      </div>
      <div class="info-container">
        <h1>{{ movie.title }}</h1>
        <p class="meta">{{ movie.year }}</p>
        <p class="summary">{{ movie.summary }}</p>

        <div class="rating-section">
          <h3>IMDb RATING</h3>
          <div class="rating-box">
            <span class="star">⭐</span>
            <span class="score">{{ movie.rating }}</span>
            <span class="total">/ 10</span>
          </div>
        </div>

        <!-- Yorum ve Puanlama Bölümü (Sonra eklenecek) -->
        <div class="user-interaction">
          <h3>YOUR RATING</h3>
          <button class="rate-btn">☆ Rate</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const movie = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const movieId = route.params.id // URL'den ID'yi al
  try {
    const response = await fetch(`http://localhost:9090/api/movies/${movieId}`)
    if (!response.ok) {
      throw new Error('Movie not found')
    }
    movie.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.movie-detail-page {
  color: white;
}
.main-content {
  display: flex;
  gap: 40px;
}
.poster-image {
  width: 300px;
  border-radius: 8px;
}
.info-container {
  flex: 1;
}
h1 {
  font-size: 3em;
  color: white;
}
.meta {
  color: #888;
  margin-bottom: 20px;
}
.summary {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 30px;
}
.rating-section,
.user-interaction {
  margin-top: 20px;
}
h3 {
  font-size: 1em;
  color: #ccc;
  letter-spacing: 1px;
}
.rating-box {
  display: flex;
  align-items: center;
  font-size: 1.5em;
}
.star {
  color: #f5c518;
  font-size: 2em;
  margin-right: 10px;
}
.rate-btn {
  background: none;
  border: 1px solid #555;
  color: white;
  padding: 15px 30px;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
