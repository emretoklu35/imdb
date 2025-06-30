// Dosya Yolu: client/src/router/index.ts (TAM KOD)

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import WatchlistView from '../views/WatchlistView.vue'
import AuthCallbackView from '../views/AuthCallback.vue'
import VideoPlayerView from '../views/VideoPlayerView.vue' // YENİ: Sayfayı import et

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: AuthView },
    { path: '/register', name: 'register', component: AuthView },
    { path: '/search/results', name: 'search-results', component: SearchResultsView },
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView },
    { path: '/watchlist', name: 'watchlist', component: WatchlistView },
    { path: '/auth/callback', name: 'auth-callback', component: AuthCallbackView },
    {
      // YENİ VİDEO ROTASI
      path: '/video/:videoId',
      name: 'video-player',
      component: VideoPlayerView,
      props: true, // URL'deki :videoId parametresini component'e prop olarak gönderir
    },
  ],
})

export default router
