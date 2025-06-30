<!-- Dosya Yolu: client/src/components/UserReviews.vue (YENİ DOSYA) -->
<template>
  <div class="user-reviews-section">
    <h3 class="section-title">User Reviews</h3>

    <!-- Yorum yoksa gösterilecek mesaj -->
    <div v-if="!reviews || reviews.length === 0" class="no-reviews">
      <p>Be the first to review this movie!</p>
    </div>

    <!-- Yorum listesi -->
    <ul v-else class="reviews-list">
      <li v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar">
              <!-- Kullanıcının baş harflerini gösteren basit bir avatar -->
              {{ getInitials(review.User.firstName, review.User.lastName) }}
            </div>
            <div class="name-country">
              <span class="user-name">{{ review.User.firstName }} {{ review.User.lastName }}</span>
              <span class="user-country">{{ review.User.country }}</span>
            </div>
          </div>
          <div class="rating-display">
            <i class="fa-solid fa-star"></i>
            <span class="score">{{ review.score }}</span>
            <span class="total">/10</span>
          </div>
        </div>
        <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
        <div class="review-date">
          {{ formatDate(review.createdAt) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Yorum objesinin yapısını tanımlıyoruz
interface Review {
  id: number
  score: number
  comment: string | null
  createdAt: string
  User: {
    firstName: string
    lastName: string
    country: string
  }
}

defineProps<{
  reviews: Review[]
}>()

// Kullanıcının adının ve soyadının baş harflerini alan yardımcı fonksiyon
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Tarihi daha okunabilir bir formata çeviren yardımcı fonksiyon
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.user-reviews-section {
  margin-top: 40px;
  border-top: 1px solid #333;
  padding-top: 30px;
}

.section-title {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 25px;
  color: #f5c518;
}

.no-reviews {
  text-align: center;
  color: #888;
  padding: 40px;
  border: 2px dashed #333;
  border-radius: 8px;
}

.reviews-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-item {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #444;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #5799ef;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2em;
}

.name-country {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  font-size: 1.1em;
}

.user-country {
  color: #aaa;
  font-size: 0.9em;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.2em;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  border-radius: 20px;
}
.rating-display .fa-star {
  color: #f5c518;
}
.rating-display .score {
  font-weight: bold;
}
.rating-display .total {
  color: #aaa;
  font-size: 0.9em;
}

.review-comment {
  line-height: 1.6;
  color: #ddd;
  margin: 0 0 15px 0;
  white-space: pre-wrap; /* Yorumlardaki satır atlamalarını korur */
}

.review-date {
  font-size: 0.8em;
  color: #888;
  text-align: right;
}
</style>
