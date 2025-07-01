<template>
  <div class="home-view">
    <div class="slider-container" v-if="featuredMovies.length > 0">
      <!-- 
        Bu başlık, i18n.js dosyasındaki 'home.featuredTitle' anahtarının
        değerini gösterecektir. O dosyada yaptığın "Top 10..." değişikliği
        burada görünecek.
      -->
      <h2 class="slider-title">
        <span>{{ t('home.featuredTitle') }}</span>
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
        <swiper-slide v-for="(movie, index) in featuredMovies" :key="movie.id">
          <SliderCard :movie="{ ...movie, rank: index + 1 }" />
        </swiper-slide>
      </swiper>
    </div>
    <div v-else class="loading-state">{{ t('home.loading') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Swiper bileşenleri ve modülleri
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import SliderCard from '../components/SliderCard.vue'

const { t } = useI18n()

interface Movie {
  id: number
  title: string
  rating: number
  posterUrl: string
  videoId?: string
}

const featuredMovies = ref<Movie[]>([])
const modules = [Navigation]

onMounted(async () => {
  try {
    // Bu API çağrısı doğru. "Öne Çıkan Filmleri" çekmeye devam ediyoruz.
    const response = await fetch('https://imdb-l6w1.onrender.com/api/movies/featured')
    if (!response.ok) throw new Error('API isteği başarısız oldu.')

    const data = await response.json()
    featuredMovies.value = data
  } catch (error) {
    console.error('Öne çıkan filmler getirilirken hata:', error)
  }
})
</script>

<style>
/* Stillerde herhangi bir değişiklik yok. */
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
  top: 40% !important;
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
