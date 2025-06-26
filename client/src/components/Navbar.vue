<!-- Dosya Yolu: client/src/components/Navbar.vue (TEKRAR DÜZELTİLMİŞ HALİ) -->

<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">IMDb</router-link>
      <div class="menu">☰ Menu</div>
    </div>

    <div class="navbar-center">
      <div class="search-container">
        <form @submit.prevent="goToSearchResults" class="search-bar">
          <select>
            <option>All</option>
          </select>
          <input
            type="text"
            placeholder="Search IMDb"
            v-model="searchQuery"
            @input="handleSearchInput"
            @blur="hideResults"
          />
          <button type="submit">🔍</button>
        </form>

        <div v-if="searchResults.length > 0" class="search-results-dropdown">
          <ul>
            <li v-for="result in searchResults" :key="result.id" @mousedown="selectResult(result)">
              {{ result.title || result.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="navbar-right">
      <router-link to="/watchlist" class="watchlist-link">+ Watchlist</router-link>

      <template v-if="authStore.isAuthenticated && authStore.user">
        <div class="user-info">Welcome, {{ authStore.user.email }}</div>
        <button @click="handleLogout" class="auth-btn">Logout</button>
      </template>

      <template v-else>
        <router-link to="/login" class="auth-btn">Sign In</router-link>
      </template>

      <div class="language">
        <select>
          <option>EN</option>
          <option>TR</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Auth store ve router
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.clearAuth()
  router.push('/login')
}

// Arama Mantığı
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: number

// Önce bu fonksiyonu tanımlayalım
const hideResults = () => {
  setTimeout(() => {
    searchResults.value = []
  }, 200)
}

const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:9090/api/search?q=${searchQuery.value}`)
      if (!response.ok) throw new Error('Network response was not ok.')

      const data = await response.json()
      const titles = data.titles || []
      const people = data.people || []

      searchResults.value = [...titles, ...people].slice(0, 3)
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
    }
  }, 300)
}

const goToSearchResults = () => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value
    hideResults()
    searchQuery.value = ''
    router.push({ name: 'search-results', query: { q: query } })
  }
}

const selectResult = (result: any) => {
  hideResults()
  searchQuery.value = ''

  if (result.title) {
    router.push({ name: 'movie-detail', params: { id: result.id } })
  }
}
</script>

<style scoped>
/* Stillerde değişiklik yok */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #121212;
  color: white;
  padding: 10px 20px;
  font-family: sans-serif;
  gap: 20px;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.watchlist-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.watchlist-link:hover {
  color: #f5c518; /* Üzerine gelince sarı olsun */
}

.navbar-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.logo {
  font-weight: bold;
  font-size: 24px;
  color: #f5c518;
  text-decoration: none;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-bar {
  display: flex;
  width: 100%;
}

.search-bar input {
  border: none;
  padding: 8px;
  outline: none;
  width: 100%;
  color: #121212;
  border-radius: 4px 0 0 4px;
}

.search-bar select {
  border: none;
  background-color: #f0f0f0;
  padding: 0 12px;
}

.search-bar button {
  border: none;
  background-color: #f0f0f0;
  padding: 0 12px;
  border-radius: 0 4px 4px 0;
}

.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #222;
  border: 1px solid #444;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.search-results-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-results-dropdown li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #444;
}

.search-results-dropdown li:last-child {
  border-bottom: none;
}

.search-results-dropdown li:hover {
  background-color: #333;
}

.user-info {
  font-weight: bold;
  white-space: nowrap;
}

.auth-btn {
  background: none;
  border: 1px solid #555;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
}

.auth-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.language select {
  background-color: #121212;
  color: white;
  border: none;
}
</style>
