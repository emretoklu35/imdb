<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">IMDb</router-link>
      <div class="menu">☰ {{ t('navbar.menu') }}</div>

      <router-link :to="{ name: 'popular-movies' }" class="nav-link"> Popular </router-link>
    </div>

    <div class="navbar-center">
      <div class="search-container">
        <div class="search-bar">
          <div class="category-selector">
            <button type="button" @click="toggleCategoryDropdown" class="category-btn">
              <span>{{ selectedCategory.name }}</span>
              <i class="fa-solid fa-caret-down arrow"></i>
            </button>
            <ul v-if="isCategoryDropdownOpen" class="category-dropdown">
              <li
                v-for="category in searchCategories"
                :key="category.key"
                @click="selectCategory(category)"
              >
                <i :class="category.icon"></i>
                <span>{{ category.name }}</span>
              </li>
            </ul>
          </div>
          <form @submit.prevent="goToSearchResults" class="search-form">
            <input
              type="text"
              :placeholder="t('navbar.searchPlaceholder')"
              v-model="searchQuery"
              @input="handleSearchInput"
              @blur="hideLiveSearchResults"
              @focus="handleSearchInput"
            />
          </form>
          <button type="submit" @click="goToSearchResults" class="search-submit-btn">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div
          v-if="searchResults.length > 0 && searchQuery.length > 0"
          class="search-results-dropdown"
        >
          <ul>
            <template v-if="groupedResults.titles.length > 0">
              <li class="group-header">Titles</li>
              <li
                v-for="result in groupedResults.titles"
                :key="`t-${result.id}`"
                @mousedown="selectResult(result)"
              >
                <img :src="result.posterUrl" class="result-image" alt="" />
                <div class="result-info">
                  <span class="result-title">{{ result.title }}</span>
                  <span class="result-year">{{ result.year }}</span>
                </div>
              </li>
            </template>
            <template v-if="groupedResults.people.length > 0">
              <li class="group-header">People</li>
              <li
                v-for="result in groupedResults.people"
                :key="`p-${result.id}`"
                @mousedown="selectResult(result)"
              >
                <img :src="result.imageUrl" class="result-image person" alt="" />
                <div class="result-info">
                  <span class="result-title">{{ result.name }}</span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <div class="navbar-right">
      <router-link to="/watchlist" class="watchlist-link"
        >+ {{ t('navbar.watchlist') }}</router-link
      >
      <template v-if="authStore.isAuthenticated && authStore.user">
        <div class="user-info">{{ t('navbar.welcome', { name: authStore.user.firstName }) }}</div>
        <button @click="handleLogout" class="auth-btn">{{ t('navbar.logout') }}</button>
      </template>
      <template v-else>
        <router-link to="/login" class="auth-btn">{{ t('navbar.signIn') }}</router-link>
      </template>
      <div class="language-selector">
        <select v-model="locale" class="language-select">
          <option value="en">EN</option>
          <option value="tr">TR</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const { t, locale } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const handleLogout = () => {
  authStore.clearAuth()
  router.push('/login')
}
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: number
const groupedResults = computed(() => {
  return searchResults.value.reduce(
    (acc, result) => {
      if (result.title) acc.titles.push(result)
      else if (result.name) acc.people.push(result)
      return acc
    },
    { titles: [] as any[], people: [] as any[] },
  )
})
const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:9090/api/search?q=${searchQuery.value}`)
      const data = await response.json()
      searchResults.value = [...(data.titles || []), ...(data.people || [])]
    } catch (error) {
      console.error('Search failed:', error)
    }
  }, 300)
}
const goToSearchResults = () => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value
    searchResults.value = []
    searchQuery.value = ''
    router.push({ name: 'search-results', query: { q: query } })
  }
}
const selectResult = (result: any) => {
  searchResults.value = []
  searchQuery.value = ''
  if (result.title) {
    router.push({ name: 'movie-detail', params: { id: result.id } })
  } else if (result.name) {
    router.push({ name: 'actor-detail', params: { id: result.id } })
  }
}
const hideLiveSearchResults = () => {
  setTimeout(() => {
    searchResults.value = []
  }, 200)
}
interface SearchCategory {
  key: string
  name: string
  icon: string
}
const isCategoryDropdownOpen = ref(false)
const searchCategories = computed<SearchCategory[]>(() => [
  { key: 'all', name: t('search_categories.all'), icon: 'fa-solid fa-magnifying-glass' },
  { key: 'titles', name: t('search_categories.titles'), icon: 'fa-solid fa-film' },
  { key: 'episodes', name: t('search_categories.episodes'), icon: 'fa-solid fa-tv' },
  { key: 'celebs', name: t('search_categories.celebs'), icon: 'fa-solid fa-user-group' },
  { key: 'companies', name: t('search_categories.companies'), icon: 'fa-solid fa-building' },
])
const selectedCategory = ref<SearchCategory>(searchCategories.value[0])
watch(locale, () => {
  const currentKey = selectedCategory.value.key
  const newCategory = searchCategories.value.find((c) => c.key === currentKey)
  if (newCategory) {
    selectedCategory.value = newCategory
  }
})
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}
const selectCategory = (category: SearchCategory) => {
  selectedCategory.value = category
  isCategoryDropdownOpen.value = false
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 8px 24px;
  background-color: #121212;
  color: white;
  font-family: 'Roboto', sans-serif, system-ui;
}
.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}
.navbar-center {
  flex-grow: 1;
  padding: 0 24px;
}
.logo {
  font-weight: bold;
  font-size: 30px;
  color: #f5c518;
  text-decoration: none;
}
.menu {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  cursor: pointer;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.nav-link:hover,
.router-link-exact-active.nav-link {
  background-color: rgba(255, 255, 255, 0.1);
}
.search-container {
  position: relative;
  width: 100%;
}
.search-bar {
  display: flex;
  background-color: white;
  border-radius: 6px;
  width: 100%;
}
.search-bar:focus-within {
  box-shadow: 0 0 0 2px rgba(245, 197, 24, 0.5);
}
.category-selector {
  position: relative;
}
.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 12px;
  background-color: #f5f5f5;
  border: none;
  border-right: 1px solid #ddd;
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  font-size: 14px;
  color: #121212;
}
.category-btn .arrow {
  font-size: 12px;
}
.category-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background-color: #2b2b2b;
  border: 1px solid #444;
  border-radius: 6px;
  z-index: 2000;
  list-style: none;
  margin: 0;
  padding: 8px 0;
  width: 250px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
.category-dropdown li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
}
.category-dropdown li:hover {
  background-color: #3c3c3c;
}
.category-dropdown li i {
  width: 20px;
  text-align: center;
  color: #aaa;
}
.category-dropdown li:first-child i {
  color: #f5c518;
}
.search-form {
  flex-grow: 1;
  display: flex;
}
.search-form input {
  width: 100%;
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 14px;
  background: transparent;
}
.search-submit-btn {
  background: transparent;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 15px;
  cursor: pointer;
  color: #555;
  font-size: 16px;
}
.search-results-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: #222;
  border: 1px solid #444;
  z-index: 1000;
  border-radius: 6px;
  overflow: hidden;
}
.search-results-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-results-dropdown li {
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-results-dropdown li:not(.group-header):hover {
  background-color: #333;
}
.result-image {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  background-color: #333;
}
.result-image.person {
  border-radius: 50%;
}
.result-info {
  display: flex;
  flex-direction: column;
}
.result-title {
  font-weight: bold;
}
.result-year {
  font-size: 0.9em;
  color: #888;
}
.group-header {
  font-weight: bold;
  color: #f5c518;
  background: #2b2b2b;
  cursor: default;
}
.navbar-right {
  white-space: nowrap;
}
.user-info {
  font-weight: bold;
}
.auth-btn,
.watchlist-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
.auth-btn {
  background: none;
  border: 1px solid #555;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.language-selector {
}
.language-select {
  background-color: transparent;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 6px 8px;
  font-weight: bold;
  cursor: pointer;
}
.language-select:focus {
  outline: none;
  border-color: #f5c518;
}
.language-select option {
  background-color: #212121;
  color: white;
}
</style>
