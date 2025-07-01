<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <header class="modal-header">
          <div class="title-group">
            <span class="header-label">USER RATINGS</span>
            <h2>{{ movieTitle }}</h2>
          </div>
          <div class="overall-rating">
            <i class="fa-solid fa-star"></i>
            <span class="score">{{ overallScore.toFixed(1) }}</span>
          </div>
        </header>
        <div class="modal-body">
          <div class="left-pane">
            <h4 class="pane-title">RATING DISTRIBUTION</h4>
            <div class="filters">
              <span class="filter-label">FILTER BY COUNTRY</span>
              <div class="country-filters">
                <button
                  @click="selectCountry('All')"
                  :class="{ active: selectedCountry === 'All' }"
                >
                  All ({{ totalVotes }})
                </button>
                <button
                  v-for="country in summaryData?.topCountries"
                  :key="country.country"
                  @click="selectCountry(country.country)"
                  :class="{ active: selectedCountry === country.country }"
                >
                  {{ country.country }} ({{ country.count }})
                </button>
              </div>
            </div>
            <div class="chart-wrapper">
              <RatingsChart v-if="chartDistribution.length > 0" :distribution="chartDistribution" />
              <div v-else class="no-data">No rating data available for this filter.</div>
            </div>
          </div>
          <div class="right-pane">
            <h4 class="pane-title">REVIEWS</h4>
            <div class="reviews-list-wrapper">
              <UserReviews :reviews="filteredReviews" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import RatingsChart from './RatingsChart.vue'
import UserReviews from './UserReviews.vue'

interface Review {
  id: number
  score: number
  comment: string | null
  createdAt: string
  User: { firstName: string; lastName: string; country: string }
}
const props = defineProps<{
  visible: boolean
  movieId: number | null
  movieTitle: string
  overallScore: number
  reviews: Review[]
}>()
const emit = defineEmits(['close'])
const summaryData = ref<any>(null)
const loading = ref(false)
const selectedCountry = ref('All')

const fetchSummaryData = async (id: number) => {
  if (!id) return
  loading.value = true
  summaryData.value = null
  try {
    const response = await fetch(`https://imdb-l6w1.onrender.com/api/movies/${id}/ratings-summary`)
    if (!response.ok) throw new Error('Failed to fetch ratings summary')
    summaryData.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
const chartDistribution = computed(() => {
  if (!summaryData.value) return []
  if (selectedCountry.value === 'All') {
    return summaryData.value.scoreDistribution
  }
  return summaryData.value.distributionByCountry.filter(
    (dist: any) => dist.country === selectedCountry.value,
  )
})
const totalVotes = computed(() => {
  if (!summaryData.value?.scoreDistribution) return 0
  return summaryData.value.scoreDistribution.reduce(
    (total: number, item: any) => total + parseInt(item.count, 10),
    0,
  )
})
const filteredReviews = computed(() => {
  if (selectedCountry.value === 'All') {
    return props.reviews
  }
  return props.reviews.filter((review) => review.User.country === selectedCountry.value)
})
const closeModal = () => {
  emit('close')
}
const selectCountry = (country: string) => {
  selectedCountry.value = country
}
watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible && props.movieId) {
      selectedCountry.value = 'All'
      fetchSummaryData(props.movieId)
    }
  },
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-content {
  background-color: #1f1f1f;
  color: white;
  padding: 25px 35px;
  border-radius: 8px;
  width: 90%;
  max-width: 1100px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  padding-bottom: 20px;
  margin-bottom: 25px;
  flex-shrink: 0;
}
.header-label {
  color: #f5c518;
  font-weight: bold;
  font-size: 0.9em;
}
.modal-header h2 {
  margin: 5px 0 0 0;
  font-size: 1.8em;
}
.overall-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5em;
}
.overall-rating .fa-star {
  color: #f5c518;
  font-size: 1.8em;
}
.overall-rating .score {
  font-weight: bold;
}
.modal-body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 40px;
  overflow: hidden;
  flex-grow: 1;
}
.left-pane,
.right-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.pane-title {
  color: #aaa;
  font-weight: bold;
  font-size: 0.9em;
  letter-spacing: 1px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 20px;
  text-transform: uppercase;
}
.filters {
  margin-bottom: 25px;
}
.filter-label {
  font-size: 0.8em;
  color: #888;
  margin-bottom: 10px;
  display: block;
}
.country-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.country-filters button {
  background-color: #333;
  border: 1px solid #555;
  color: #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.country-filters button:hover {
  background-color: #444;
  border-color: #777;
}
.country-filters button.active {
  background-color: #f5c518;
  color: #121212;
  border-color: #f5c518;
  font-weight: bold;
}
.chart-wrapper {
  height: 300px;
  position: relative;
}
.reviews-list-wrapper {
  overflow-y: auto;
  padding-right: 15px;
}
.reviews-list-wrapper::-webkit-scrollbar {
  width: 8px;
}
.reviews-list-wrapper::-webkit-scrollbar-track {
  background: #2c2c2c;
}
.reviews-list-wrapper::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}
.reviews-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #666;
}
.no-data {
  color: #888;
  text-align: center;
  padding: 50px 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
