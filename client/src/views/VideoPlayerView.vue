<template>
  <div v-if="loading" class="video-player-page-centered">Yükleniyor...</div>
  <div v-else-if="error" class="video-player-page-centered">{{ error }}</div>

  <div v-else-if="movie" class="video-player-page">
    <div class="video-section">
      <div class="video-header">
        <router-link to="/" class="close-btn">
          <i class="fa-solid fa-xmark"></i> Close
        </router-link>
      </div>
      <div class="video-player">
        <iframe
          :src="youtubeEmbedUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="info-section">
      <router-link :to="{ name: 'movie-detail', params: { id: movie.id } }" class="info-header">
        <img :src="movie.posterUrl" :alt="movie.title" class="info-poster" />
        <div class="info-title-group">
          <h3 class="info-title">{{ movie.title }}</h3>
          <p class="info-year">{{ movie.year }}</p>
        </div>
        <i class="fa-solid fa-chevron-right"></i>
      </router-link>

      <div class="info-body">
        <h4>{{ movie.trailerTitle || `${movie.title} Trailer` }}</h4>
        <p class="info-summary" :class="{ 'is-expanded': isExpanded }">
          {{ movie.trailerSummary || 'Bu fragman için bir açıklama mevcut değil.' }}
        </p>
        <button v-if="isExpandable" @click="toggleExpand" class="expand-btn">
          <i :class="isExpanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Movie {
  id: number
  title: string
  year: number
  posterUrl: string
  videoId: string
  summary?: string
  trailerTitle?: string
  trailerSummary?: string
}

const props = defineProps<{ videoId: string }>()
const movie = ref<Movie | null>(null)
const loading = ref(true)
const error = ref('')
const isExpanded = ref(false)
const isExpandable = computed(
  () => movie.value?.trailerSummary && movie.value.trailerSummary.length > 150,
)
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
const youtubeEmbedUrl = computed(
  () => `https://www.youtube.com/embed/${props.videoId}?autoplay=1&mute=1`,
)

onMounted(async () => {
  try {
    const response = await fetch(
      `https://imdb-l6w1.onrender.com/api/movies/by-video/${props.videoId}`,
    )
    if (!response.ok) throw new Error('Film bilgileri bulunamadı.')
    movie.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.video-player-page-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  color: white;
  font-size: 1.5em;
  background-color: #121212;
}
.video-player-page {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  z-index: 1000;
  color: white;
}
.video-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  background-color: #000;
}
.video-header {
  display: flex;
  padding: 10px 15px;
  background-color: #1f1f1f;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
}
.close-btn i {
  margin-right: 8px;
}
.video-player {
  flex-grow: 1;
  position: relative;
}
.video-player iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.info-section {
  flex: 1;
  padding: 20px;
  background-color: #1f1f1f;
  overflow-y: auto;
}
.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: inherit;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
}
.info-header:hover .info-title {
  text-decoration: underline;
}
.info-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}
.info-title-group {
  flex-grow: 1;
}
.info-title {
  font-size: 18px;
  margin: 0 0 5px 0;
}
.info-year {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}
.fa-chevron-right {
  color: #888;
}
.info-body {
  position: relative;
}
.info-body h4 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 10px;
}
.info-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #ddd;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
}
.info-summary.is-expanded {
  -webkit-line-clamp: unset;
  max-height: 1000px;
}
.expand-btn {
  background: linear-gradient(to top, #1f1f1f 50%, transparent);
  border: none;
  color: white;
  cursor: pointer;
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  padding: 20px 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expand-btn i {
  font-size: 20px;
}
</style>
