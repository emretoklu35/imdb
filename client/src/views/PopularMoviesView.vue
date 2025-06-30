<template>
  <div class="popular-movies-page">
    <h1 class="page-title">Most Popular Movies</h1>
    <p class="page-subtitle">Based on user interactions and ratings</p>

    <div v-if="loading" class="loading-state">Loading popular movies...</div>

    <div v-else-if="movies.length > 0" class="movies-list-container">
      <div v-for="(movie, index) in movies" :key="movie.id" class="movie-list-item">
        <!-- Sıralama Numarası -->
        <div class="rank-container">
          <span class="rank-number">{{ index + 1 }}</span>
        </div>
        <!-- Film Kartı -->
        <div class="card-container">
          <MovieCard :movie="movie" />
        </div>
        <!-- Film Detayları -->
        <div class="details-container">
          <router-link
            :to="{ name: 'movie-detail', params: { id: movie.id } }"
            class="movie-title-link"
          >
            <h2>{{ movie.title }}</h2>
          </router-link>
          <p class="movie-summary">{{ movie.summary }}</p>
          <div class="movie-meta">
            <span><i class="fa-solid fa-eye"></i> {{ movie.viewCount }} views</span>
            <span><i class="fa-solid fa-star"></i> {{ movie.ratingCount }} ratings</span>
            <span class="popularity-score"
              >Popularity Score: {{ movie.popularityScore.toFixed(0) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">No movies found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieCard from '../components/MovieCard.vue' // MovieCard'ı burada da kullanıyoruz

const movies = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:9090/api/movies/list/by-popularity')
    if (!response.ok) throw new Error('Failed to fetch popular movies')
    movies.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.popular-movies-page {
  padding: 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
}

.page-title {
  color: #f5c518;
  font-size: 2.5em;
  margin-bottom: 5px;
}

.page-subtitle {
  color: #aaa;
  margin-top: 0;
  margin-bottom: 40px;
}

.loading-state {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #888;
}

.movies-list-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.movie-list-item {
  display: grid;
  grid-template-columns: 50px 160px 1fr;
  gap: 25px;
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  align-items: flex-start;
}

.rank-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.rank-number {
  font-size: 2em;
  font-weight: bold;
  color: #555;
}

.details-container {
  display: flex;
  flex-direction: column;
}

.movie-title-link {
  text-decoration: none;
  color: white;
}
.movie-title-link:hover h2 {
  color: #f5c518;
}
.details-container h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.movie-summary {
  color: #ccc;
  font-size: 0.9em;
  line-height: 1.5;
  margin: 0 0 15px 0;
  /* Yazı 3 satırdan uzunsa kes ve ... koy */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.movie-meta {
  display: flex;
  gap: 20px;
  font-size: 0.8em;
  color: #888;
  margin-top: auto;
}
.movie-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.popularity-score {
  font-weight: bold;
  color: #aaa;
}
</style>
