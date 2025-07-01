<template>
  <div v-if="loading" class="loading-state">Loading...</div>
  <div v-else-if="actor" class="actor-detail-page">
    <div class="actor-header">
      <img :src="actor.imageUrl" :alt="actor.name" class="actor-image" />
      <h1 class="actor-name">{{ actor.name }}</h1>
    </div>
    <div class="filmography">
      <h2>Filmography</h2>
      <div v-if="actor.Movies && actor.Movies.length > 0" class="movie-grid">
        <MovieCard v-for="movie in actor.Movies" :key="movie.id" :movie="movie" />
      </div>
      <p v-else>No movies found for this actor.</p>
    </div>
  </div>
  <div v-else class="loading-state">Actor not found.</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'

const route = useRoute()
const actor = ref<any>(null)
const loading = ref(true)

const fetchActorDetails = async (id: string | string[]) => {
  loading.value = true
  actor.value = null
  try {
    const response = await fetch(`https://imdb-l6w1.onrender.com/api/actors/${id}`)
    if (!response.ok) throw new Error('Actor not found')
    actor.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch actor details:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActorDetails(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchActorDetails(newId)
    }
  },
)
</script>

<style scoped>
.actor-detail-page {
  padding: 20px 40px;
  color: white;
  max-width: 1400px;
  margin: 0 auto;
}
.actor-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 50px;
  border-bottom: 1px solid #333;
  padding-bottom: 30px;
}
.actor-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #444;
}
.actor-name {
  font-size: 3em;
  font-weight: bold;
}
.filmography h2 {
  font-size: 2em;
  color: #f5c518;
  margin-bottom: 20px;
}
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
.loading-state {
  text-align: center;
  padding: 100px;
  font-size: 1.5em;
  color: #888;
}
</style>
