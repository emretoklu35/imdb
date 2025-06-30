<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">IMDb</router-link>
      <!-- DEĞİŞTİ -->
      <div class="menu">☰ {{ t('navbar.menu') }}</div>
    </div>

    <div class="navbar-center">
      <div class="search-container">
        <div class="search-bar">
          <!-- KATEGORİ SEÇİM BUTONU VE MENÜSÜ -->
          <div class="category-selector">
            <!-- DEĞİŞTİ -->
            <button type="button" @click="toggleCategoryDropdown" class="category-btn">
              <span>{{ selectedCategory.name }}</span>
              <i class="fa-solid fa-caret-down arrow"></i>
            </button>
            <ul v-if="isCategoryDropdownOpen" class="category-dropdown">
              <!-- DEĞİŞTİ -->
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

          <!-- ARAMA FORMU -->
          <form @submit.prevent="goToSearchResults" class="search-form">
            <!-- DEĞİŞTİ -->
            <input
              type="text"
              :placeholder="t('navbar.searchPlaceholder')"
              v-model="searchQuery"
              @input="handleSearchInput"
              @blur="hideLiveSearchResults"
            />
          </form>

          <!-- ARAMA BUTONU -->
          <button type="submit" @click="goToSearchResults" class="search-submit-btn">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <!-- ANLIK ARAMA SONUÇLARI -->
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
      <!-- DEĞİŞTİ -->
      <router-link to="/watchlist" class="watchlist-link"
        >+ {{ t('navbar.watchlist') }}</router-link
      >
      <template v-if="authStore.isAuthenticated && authStore.user">
        <!-- DEĞİŞTİ -->
        <div class="user-info">{{ t('navbar.welcome', { name: authStore.user.firstName }) }}</div>
        <!-- DEĞİŞTİ -->
        <button @click="handleLogout" class="auth-btn">{{ t('navbar.logout') }}</button>
      </template>
      <template v-else>
        <!-- DEĞİŞTİ -->
        <router-link to="/login" class="auth-btn">{{ t('navbar.signIn') }}</router-link>
      </template>

      <!-- Dil seçimi bölümü -->
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
import { ref, computed, watch } from 'vue' // 'computed' ve 'watch' eklendi
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// 't' çeviri fonksiyonu ve 'locale' dil değişkeni alındı
const { t, locale } = useI18n()

const authStore = useAuthStore()
const router = useRouter()

// --- Auth ---
const handleLogout = () => {
  authStore.clearAuth()
  router.push('/login')
}

// --- Arama Mantığı ---
const searchQuery = ref('')
const searchResults = ref<any[]>([])
let searchTimeout: number

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
      searchResults.value = [...(data.titles || []), ...(data.people || [])].slice(0, 3)
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
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
  }
}

const hideLiveSearchResults = () => {
  setTimeout(() => {
    searchResults.value = []
  }, 200)
}

// --- KATEGORİ MENÜSÜ MANTIĞI ---
interface SearchCategory {
  key: string
  name: string
  icon: string
}
const isCategoryDropdownOpen = ref(false)

// DEĞİŞTİ: Kategori listesi artık reaktif bir 'computed' property
const searchCategories = computed<SearchCategory[]>(() => [
  { key: 'all', name: t('search_categories.all'), icon: 'fa-solid fa-magnifying-glass' },
  { key: 'titles', name: t('search_categories.titles'), icon: 'fa-solid fa-film' },
  { key: 'episodes', name: t('search_categories.episodes'), icon: 'fa-solid fa-tv' },
  { key: 'celebs', name: t('search_categories.celebs'), icon: 'fa-solid fa-user-group' },
  { key: 'companies', name: t('search_categories.companies'), icon: 'fa-solid fa-building' },
])

// DEĞİŞTİ: Başlangıç değeri de computed property'den alınıyor
const selectedCategory = ref<SearchCategory>(searchCategories.value[0])

// YENİ: Dil değiştiğinde, seçili kategorinin de adını güncellemek için
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
/* Stillerde bir değişiklik yok, önceki haliyle aynı kalabilir */
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

/* ARAMA BARI */
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

/* KATEGORİ BUTONU VE MENÜSÜ */
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

/* ARAMA FORMU */
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

/* ANLIK ARAMA SONUÇLARI */
.search-results-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: #222;
  border: 1px solid #444;
  z-index: 1000;
  padding: 10px;
}
.search-results-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-results-dropdown li {
  padding: 8px 0;
  color: white;
  cursor: pointer;
}
.search-results-dropdown li:hover {
  background-color: #333;
}

/* SAĞ TARAF */
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

/* DİL SEÇİM MENÜSÜ İÇİN STİLLER */
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
