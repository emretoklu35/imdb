<!-- Dosya Yolu: client/src/components/RatingModal.vue (YENİ VE GÜNCELLENMİŞ KOD) -->
<template>
  <!-- Geçiş efekti için <transition> etiketi ekledik -->
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <!-- YENİ: Başlık ikonu -->
        <div class="header-icon">
          <span class="big-star">★</span>
          <span class="question-mark">?</span>
        </div>

        <!-- Kapatma butonu -->
        <button class="close-btn" @click="closeModal">×</button>

        <p class="rate-this-text">RATE THIS</p>
        <h2 class="movie-title">{{ movieTitle }}</h2>

        <div class="stars-container">
          <span
            v-for="star in 10"
            :key="star"
            class="star-icon"
            :class="{ filled: star <= hoverRating || star <= selectedRating }"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            @click="selectRating(star)"
          >
            ☆
          </span>
        </div>

        <!-- YORUM BÖLÜMÜNÜ KALDIRDIK, daha sade bir yapı -->
        <div class="modal-footer">
          <button class="rate-btn" :disabled="selectedRating === 0" @click="handleSubmit">
            Rate
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  visible: boolean
  movieTitle: string
}>()

const emit = defineEmits(['close', 'submit'])

const selectedRating = ref(0)
const hoverRating = ref(0)
// Yorum ref'ini kaldırdık, artık ihtiyacımız yok.

const selectRating = (rating: number) => {
  selectedRating.value = rating
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (selectedRating.value === 0) return

  // Sadece puanı gönderiyoruz, yorumu boş bir string olarak yollayabiliriz.
  // Backend'imiz opsiyonel yorumu kaldırabilecek şekilde ayarlanmıştı.
  emit('submit', {
    score: selectedRating.value,
    comment: '', // Yorum alanı olmadığı için boş gönderiyoruz
  })
  closeModal()
}
</script>

<style scoped>
/* YENİ VE TASARIMA UYGUN STİLLER */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 20, 20, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #212121;
  padding: 40px;
  border-radius: 8px;
  width: 90%;
  max-width: 550px;
  color: white;
  position: relative;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 28px;
  font-weight: 300;
  cursor: pointer;
  line-height: 1;
}

.header-icon {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.big-star {
  font-size: 80px;
  color: #5799ef; /* IMDb Mavi */
  line-height: 1;
}

.question-mark {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: #212121; /* Arkaplan rengiyle aynı */
}

.rate-this-text {
  color: #f5c518; /* IMDb Sarı */
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}

.movie-title {
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 25px 0;
}

.stars-container {
  display: flex; /* YENİ: Yıldızları esnek bir kutuya koyar */
  justify-content: center; /* YENİ: Yıldızları yatayda ortalar */
  flex-wrap: nowrap; /* ÖNEMLİ: Alt satıra kaymayı engeller */
  margin-bottom: 30px;
}

.star-icon {
  font-size: 32px;
  color: #777;
  cursor: pointer;
  padding: 0 4px; /* Daha dar bir boşluk için 5px'ten 4px'e düşürebiliriz */
  transition:
    color 0.2s,
    transform 0.1s;
}

.star-icon.filled {
  color: #5799ef;
}

.star-icon:hover {
  transform: scale(1.3);
}

.rate-btn {
  width: 100%;
  max-width: 200px;
  padding: 12px;
  background-color: #444;
  color: #999;
  border: none;
  border-radius: 50px; /* Tamamen yuvarlak köşeler */
  font-weight: bold;
  font-size: 16px;
  cursor: not-allowed;
  transition: all 0.2s;
}

.rate-btn:not(:disabled) {
  background-color: #f5f5f5;
  color: #121212;
  cursor: pointer;
}

.rate-btn:not(:disabled):hover {
  background-color: #ddd;
}

/* Geçiş Efektleri */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
