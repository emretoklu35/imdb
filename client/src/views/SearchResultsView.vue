<!-- client/src/views/SearchResultsView.vue -->
<template>
  <div class="search-results-page">
    <!-- Sayfa başlığı, URL'deki arama terimini gösterir -->
    <h1>Search results for "{{ query }}"</h1>

    <!-- Veri yüklenirken gösterilecek mesaj -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Hiç sonuç bulunamazsa gösterilecek mesaj -->
    <div
      v-if="!loading && results.titles.length === 0 && results.people.length === 0"
      class="no-results"
    >
      No results found for your query.
    </div>

    <!-- Film/Dizi Sonuçları Bölümü -->
    <div v-if="results.titles.length > 0" class="results-section">
      <h2>Titles</h2>
      <ul>
        <!-- Gelen her bir 'title' için bir liste elemanı oluşturulur -->
        <li v-for="title in results.titles" :key="title.id">
          <!-- Her bir liste elemanı, o filmin detay sayfasına giden bir linktir -->
          <router-link
            :to="{ name: 'movie-detail', params: { id: title.id } }"
            class="result-item-link"
          >
            <!-- TODO: Buraya filmin küçük bir posterini ekleyebiliriz -->
            <div class="info">
              <p class="title">{{ title.title }}</p>
              <p class="year">{{ title.year }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Kişi Sonuçları Bölümü -->
    <div v-if="results.people.length > 0" class="results-section">
      <h2>People</h2>
      <ul>
        <!-- Gelen her bir 'person' için bir liste elemanı oluşturulur -->
        <li v-for="person in results.people" :key="person.id">
          <!-- TODO: Kişinin detay sayfasına giden bir link ekleyebiliriz -->
          <div class="result-item-link">
            <div class="info">
              <p class="title">{{ person.name }}</p>
              <p class="year">{{ person.knownFor }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute() // Aktif rota bilgilerini almak için
const query = ref(route.query.q || '') // URL'deki '?q=' parametresini al
const results = ref<{ titles: any[]; people: any[] }>({ titles: [], people: [] })
const loading = ref(false)

// Arama sonuçlarını backend'den çeken fonksiyon
const fetchSearchResults = async (searchQuery: string) => {
  if (!searchQuery) return
  loading.value = true
  results.value = { titles: [], people: [] }
  try {
    const response = await fetch(`https://imdb-l6w1.onrender.com/api/search?q=${searchQuery}`)
    const data = await response.json()
    results.value = data
  } catch (error) {
    console.error('Failed to fetch search results:', error)
  } finally {
    loading.value = false
  }
}

// Sayfa ilk yüklendiğinde arama işlemini başlat
onMounted(() => {
  fetchSearchResults(query.value as string)
})

// Kullanıcı aynı sayfadayken yeni bir arama yaparsa (URL'deki query değişirse),
// 'watch' sayesinde bu değişikliği yakalayıp tekrar arama yaparız.
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = newQuery || ''
    fetchSearchResults(query.value as string)
  },
)
</script>

<style scoped>
.results-section {
  margin-bottom: 40px;
}
.results-section h2 {
  color: #f5c518;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
/* Link stilleri */
.result-item-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 10px 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.result-item-link:hover {
  background-color: #1a1a1a;
}
.result-item-link:hover .title {
  text-decoration: underline; /* Linkin üzerine gelince başlığın altını çiz */
}

.info {
  margin-left: 15px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.year {
  color: #888;
}

.loading,
.no-results {
  font-size: 1.2em;
  color: #888;
  text-align: center;
  padding: 50px 0;
}
</style>
