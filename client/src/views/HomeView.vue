<template>
  <div class="home-view">
    <div class="slider-container" v-if="topMovies.length > 0">
      <!-- YENİ: BAŞLIK i18n İLE DİNAMİK HALE GETİRİLDİ -->
      <h2 class="slider-title">
        <span>{{ t('home.topTenTitle') }}</span>
      </h2>
      <swiper
        :modules="modules"
        :slides-per-view="6"
        :space-between="15"
        :navigation="true"
        :loop="false"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 15 },
          1024: { slidesPerView: 5, spaceBetween: 15 },
          1280: { slidesPerView: 6, spaceBetween: 15 },
        }"
        class="movie-swiper"
      >
        <swiper-slide v-for="(movie, index) in topMovies" :key="movie.id">
          <SliderCard :movie="{ ...movie, rank: index + 1 }" />
        </swiper-slide>
      </swiper>
    </div>
    <!-- YENİ: YÜKLENME MESAJI i18n İLE DİNAMİK HALE GETİRİLDİ -->
    <div v-else class="loading-state">{{ t('home.loading') }}</div>

    <!-- Buraya gelecekte başka bölümler ekleyebilirsin -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n' // YENİ: i18n'i kullanmak için import et

// Swiper bileşenleri ve modülleri
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Genel MovieCard yerine, slider için özel tasarladığımız kartı import ediyoruz
import SliderCard from '../components/SliderCard.vue'

// YENİ: Çeviri fonksiyonunu (`t`) kullanıma alıyoruz
const { t } = useI18n()

interface Movie {
  id: number
  title: string
  rating: number
  posterUrl: string
  trailerUrl?: string // Bu alanın adı videoId olarak güncellenmiş olabilir, projenize göre kontrol ediniz.
}

const topMovies = ref<Movie[]>([])
const modules = [Navigation]

onMounted(async () => {
  try {
    // API adresinin doğru olduğundan emin ol: http://localhost:9090
    const response = await fetch('http://localhost:9090/api/movies/top-10')
    if (!response.ok) throw new Error('API isteği başarısız oldu.')
    const data = await response.json()
    console.log("API'den gelen veri:", data) // KONSOLDA VERİYİ KONTROL ET!
    topMovies.value = data
  } catch (error) {
    console.error('Top 10 filmleri getirilirken hata:', error)
  }
})
</script>

<style>
/* Stillerde herhangi bir değişiklik yok, olduğu gibi kalabilir. */
/* Swiper oklarını ve genel slider container'ı şekillendirmek için 
   SCOPED OLMAYAN bir <style> etiketi kullanıyoruz. */

.slider-container {
  padding: 20px 40px;
  max-width: 1600px;
  margin: 20px auto;
}

.slider-title {
  color: #f5c518;
  margin-bottom: 20px;
  font-size: 24px;
  display: flex;
  align-items: center;
  font-weight: 700;
}

.slider-title span {
  border-left: 4px solid #f5c518;
  padding-left: 10px;
}

.swiper-button-prev,
.swiper-button-next {
  color: white !important;
  background-color: rgba(20, 20, 20, 0.7);
  border-radius: 50%;
  width: 50px !important;
  height: 50px !important;
  transition: background-color 0.2s;
  top: 40% !important; /* Okları dikey olarak posterin ortasına yaklaştırır */
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(20, 20, 20, 1);
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 22px !important;
  font-weight: bold;
}

.swiper-button-disabled {
  display: none !important;
}

.swiper-slide {
  height: auto;
}

.loading-state {
  text-align: center;
  color: #888;
  padding: 50px;
  font-size: 1.2em;
}
</style>
