<!-- Dosya Yolu: client/src/components/SliderCard.vue (TAM KOD) -->
<template>
  <div class="slider-movie-card">
    <div class="poster-wrapper">
      <router-link :to="{ name: 'movie-detail', params: { id: movie.id } }">
        <img :src="movie.posterUrl" :alt="movie.title" class="poster-img" />
      </router-link>
      <button
        class="watchlist-icon-btn"
        :class="{ 'is-added': isMovieInWatchlist }"
        @click="handleWatchlistClick"
      >
        <i :class="isMovieInWatchlist ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
      </button>
    </div>
    <div class="info">
      <div class="rating-line">
        <span class="rating">
          <i class="fa-solid fa-star star-icon"></i>
          {{ movie.rating }}
        </span>
        <i class="fa-regular fa-star rate-it-icon"></i>
      </div>
      <router-link :to="{ name: 'movie-detail', params: { id: movie.id } }" class="title-link">
        <h3 class="title">{{ movie.rank }}. {{ movie.title }}</h3>
      </router-link>
      <div class="actions">
        <button class="action-btn watchlist-btn" @click="handleWatchlistClick">
          <i :class="isMovieInWatchlist ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
          {{ isMovieInWatchlist ? 'In Watchlist' : 'Watchlist' }}
        </button>

        <!-- DEĞİŞTİ: Artık bir router-link -->
        <router-link
          v-if="movie.videoId"
          :to="{ name: 'video-player', params: { videoId: movie.videoId } }"
          class="action-btn trailer-btn"
        >
          <i class="fa-solid fa-play"></i>
          Trailer
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{
  movie: {
    id: number
    rank: number
    title: string
    rating: number
    posterUrl: string
    videoId?: string // DEĞİŞTİ: trailerUrl -> videoId
  }
}>()

const authStore = useAuthStore()
const router = useRouter()

const isMovieInWatchlist = computed(() => authStore.isInWatchlist(props.movie.id))

const handleWatchlistClick = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (isMovieInWatchlist.value) {
    authStore.removeFromWatchlist(props.movie.id)
  } else {
    authStore.addToWatchlist(props.movie.id)
  }
}
</script>

<style scoped>
/* Stillerde bir değişiklik yok, önceki haliyle aynı kalabilir. */
a,
.title-link {
  text-decoration: none;
  color: inherit;
}
.slider-movie-card {
  color: white;
  display: flex;
  flex-direction: column;
}
.poster-wrapper {
  position: relative;
  margin-bottom: 12px;
}
.poster-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  border-radius: 4px;
}
.watchlist-icon-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 50px;
  background-color: rgba(18, 18, 18, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 0 0 0;
  transition: background-color 0.2s;
}
.watchlist-icon-btn.is-added {
  background-color: #f5c518;
  color: black;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rating-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.rating {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}
.star-icon {
  color: #f5c518;
}
.rate-it-icon {
  color: #5799ef;
  cursor: pointer;
  font-size: 18px;
}
.title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title-link:hover .title {
  text-decoration: underline;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.action-btn {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}
.watchlist-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.watchlist-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.trailer-btn {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
.trailer-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
