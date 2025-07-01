<template>
  <div v-if="loading" class="loading-state">Loading...</div>
  <div v-else-if="error" class="error-state">{{ error }}</div>

  <div v-else-if="movie" class="movie-detail-page">
    <header class="detail-header">
      <!-- Başlık ve Meta Bilgileri -->
      <div class="header-left">
        <h1 class="movie-title">{{ movie.title }}</h1>
        <div class="meta-info">
          <span>{{ movie.year }}</span>
          <span v-if="movie.ageRating">{{ movie.ageRating }}</span>
          <span v-if="movie.duration">{{ movie.duration }}</span>
        </div>
      </div>

      <!-- Puanlama Bölümleri -->
      <div class="header-right">
        <!-- IMDb Puanı (Tıklanabilir) -->
        <div class="rating-group clickable" @click="isRatingsDetailModalVisible = true">
          <span class="rating-label">IMDb RATING <i class="fa-solid fa-chevron-down"></i></span>
          <div class="rating-value-box">
            <i class="fa-solid fa-star imdb-star-icon"></i>
            <div>
              <span class="score">{{ movie.rating.toFixed(1) }}</span>
              <span class="total">/10</span>
            </div>
          </div>
        </div>

        <!-- Kullanıcı Puanı -->
        <div class="rating-group">
          <span class="rating-label">YOUR RATING</span>
          <div class="rating-value-box user-rate-box">
            <button v-if="!userRating" class="rate-btn-icon" @click="openRatingModal">
              <i class="fa-regular fa-star"></i>
              <span>Rate</span>
            </button>
            <div v-else class="user-rating-display">
              <i class="fa-solid fa-star user-star-icon"></i>
              <span>{{ userRating }}</span>
              <span class="total">/10</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="detail-main-content">
      <div class="poster-container">
        <img :src="movie.posterUrl" :alt="movie.title" class="poster-image" />
        <button
          class="watchlist-icon-btn"
          :class="{ 'is-added': isMovieInWatchlist }"
          @click="handleWatchlistClick"
        >
          <i :class="isMovieInWatchlist ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
        </button>
      </div>
      <div class="media-container">
        <div v-if="movie.videoId" class="video-wrapper">
          <iframe
            :src="`https://www.youtube.com/embed/${movie.videoId}?autoplay=1&mute=1`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div v-else class="video-placeholder"><p>No trailer available</p></div>
      </div>
    </main>

    <section class="summary-section">
      <h3>Summary</h3>
      <p class="summary">{{ movie.summary || 'No summary available.' }}</p>
    </section>

    <section class="actors-section" v-if="movie.Actors && movie.Actors.length > 0">
      <h3>Cast</h3>
      <div class="actors-grid">
        <router-link
          v-for="actor in movie.Actors"
          :key="actor.id"
          :to="{ name: 'actor-detail', params: { id: actor.id } }"
          class="actor-card"
        >
          <img :src="actor.imageUrl" :alt="actor.name" class="actor-image" />
          <span class="actor-name">{{ actor.name }}</span>
        </router-link>
      </div>
    </section>

    <UserReviews :reviews="reviews" />

    <!-- PUANLAMA MODAL'I (Rate Butonu için) -->
    <RatingModal
      :visible="isRatingModalVisible"
      :movie-title="movie ? movie.title : ''"
      @close="isRatingModalVisible = false"
      @submit="handleRatingSubmit"
    />

    <!-- PUAN DETAY/GRAFİK MODAL'I -->
    <RatingsDetailModal
      :visible="isRatingsDetailModalVisible"
      :movie-id="movie ? movie.id : null"
      :movie-title="movie ? movie.title : ''"
      :overall-score="movie ? movie.rating : 0"
      :reviews="reviews"
      @close="isRatingsDetailModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RatingModal from '@/components/RatingModal.vue'
import UserReviews from '@/components/UserReviews.vue'
import RatingsDetailModal from '@/components/RatingsDetailModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const movie = ref<any>(null)
const reviews = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const isRatingModalVisible = ref(false)
const isRatingsDetailModalVisible = ref(false)
const userRating = ref<number | null>(null)

const fetchReviews = async (movieId: string | string[]) => {
  try {
    const response = await fetch(`https://imdb-l6w1.onrender.com/api/movies/${movieId}/ratings`)
    if (!response.ok) throw new Error('Could not fetch reviews')
    reviews.value = await response.json()
    updateUserRatingFromReviews()
  } catch (err) {
    console.error('Fetch reviews error:', err)
  }
}

const updateUserRatingFromReviews = () => {
  if (authStore.isAuthenticated && reviews.value.length > 0) {
    const currentUserReview = reviews.value.find((review) => review.User.id === authStore.user?.id)
    userRating.value = currentUserReview ? currentUserReview.score : null
  } else {
    userRating.value = null
  }
}

const openRatingModal = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  isRatingModalVisible.value = true
}

const handleRatingSubmit = async (ratingData: { score: number; comment: string }) => {
  const movieId = route.params.id
  userRating.value = ratingData.score
  try {
    const response = await fetch(`https://imdb-l6w1.onrender.com/api/movies/${movieId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': authStore.token! },
      body: JSON.stringify(ratingData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.msg || 'Rating submission failed')
    await fetchReviews(movieId)
  } catch (err: any) {
    userRating.value = null
    console.error('Rating submission error:', err)
    alert(`Error: ${err.message}`)
  }
}

const isMovieInWatchlist = computed(() => {
  if (!movie.value) return false
  return authStore.isInWatchlist(movie.value.id)
})

const handleWatchlistClick = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (isMovieInWatchlist.value) {
    authStore.removeFromWatchlist(movie.value.id)
  } else {
    authStore.addToWatchlist(movie.value.id)
  }
}

const fetchMovieData = async (movieId: string | string[]) => {
  loading.value = true
  error.value = ''
  try {
    const [movieResponse, reviewsResponse] = await Promise.all([
      fetch(`https://imdb-l6w1.onrender.com/api/movies/${movieId}`),
      fetch(`https://imdb-l6w1.onrender.com/api/movies/${movieId}/ratings`),
    ])

    if (!movieResponse.ok) throw new Error('Movie not found')
    movie.value = await movieResponse.json()

    if (reviewsResponse.ok) {
      reviews.value = await reviewsResponse.json()
      updateUserRatingFromReviews()
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovieData(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => {
    if (route.name === 'movie-detail' && newId) {
      fetchMovieData(newId as string)
    }
  },
)
</script>

<style scoped>
.movie-detail-page {
  padding: 20px 40px;
  color: white;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}
.loading-state,
.error-state {
  text-align: center;
  padding: 100px;
  font-size: 1.5em;
  color: #888;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 20px;
}
.header-left .movie-title {
  font-size: 3.2em;
  font-weight: 700;
  margin: 0 0 10px 0;
}
.header-left .meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #aaa;
  font-size: 1.1em;
}
.meta-info span:not(:last-child)::after {
  content: '•';
  margin-left: 15px;
}
.header-right {
  display: flex;
  gap: 30px;
  padding-top: 10px;
}
.rating-group {
  text-align: center;
}
.rating-group.clickable {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}
.rating-group.clickable:hover {
  background-color: #2c2c2c;
}
.rating-label {
  font-weight: bold;
  color: #ccc;
  font-size: 0.9em;
  display: block;
  margin-bottom: 8px;
}
.rating-label .fa-chevron-down {
  font-size: 0.8em;
  margin-left: 5px;
  opacity: 0.7;
}
.rating-value-box {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.rating-value-box .score {
  font-size: 1.5em;
  font-weight: bold;
}
.rating-value-box .total {
  font-size: 1.1em;
  color: #aaa;
}
.imdb-star-icon {
  color: #f5c518;
  font-size: 2em;
}
.user-rate-box .rate-btn-icon {
  background: none;
  border: none;
  color: #5799ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 1.1em;
}
.user-rate-box .rate-btn-icon i {
  font-size: 1.8em;
}
.user-rate-box .rate-btn-icon span {
  font-weight: bold;
}
.user-rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-star-icon {
  color: #5799ef;
  font-size: 2em;
}
.detail-main-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-bottom: 30px;
}
.poster-container {
  position: relative;
}
.poster-image {
  width: 100%;
  border-radius: 8px;
  display: block;
}
.watchlist-icon-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 50px;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(2px);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 0 8px 0;
  transition: background-color 0.2s;
}
.watchlist-icon-btn.is-added {
  background-color: #5799ef;
  color: black;
}
.watchlist-icon-btn:hover {
  background-color: rgba(40, 40, 40, 0.8);
}
.media-container {
  min-width: 0;
  position: relative;
}
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.summary-section {
  max-width: 75%;
}
.summary-section h3 {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 15px;
  color: #f5c518;
}
.summary-section p {
  font-size: 1.1em;
  line-height: 1.7;
  color: #ddd;
}
.video-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #000;
  border-radius: 8px;
  color: #888;
}
.actors-section {
  margin-top: 40px;
}
.actors-section h3 {
  font-size: 1.8em;
  color: #f5c518;
  margin-bottom: 20px;
  border-top: 1px solid #333;
  padding-top: 30px;
}
.actors-grid {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 15px;
}
.actor-card {
  text-decoration: none;
  color: white;
  text-align: center;
  display: block;
  width: 100px;
  flex-shrink: 0;
}
.actor-card:hover .actor-name {
  text-decoration: underline;
}
.actor-card .actor-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #333;
  transition: border-color 0.2s;
}
.actor-card:hover .actor-image {
  border-color: #f5c518;
}
.actor-card .actor-name {
  font-weight: bold;
  font-size: 0.9em;
}
</style>
