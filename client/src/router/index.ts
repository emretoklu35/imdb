// client/src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'

// Uygulamamızdaki tüm sayfaları (view'ları) import ediyoruz
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import MovieDetailView from '../views/MovieDetailView.vue' // Yeni detay sayfasını da ekledik
import WatchlistView from '../views/WatchlistView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // Uygulamamızdaki tüm yolları ve bu yollara
  // karşılık gelen bileşenleri (sayfaları) burada tanımlıyoruz.
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/search/results',
      name: 'search-results',
      component: SearchResultsView,
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetailView,
    },
    {
      // YENİ ROTA
      path: '/watchlist',
      name: 'watchlist',
      component: WatchlistView,
    },
    {
      // Bu dinamik bir rotadır. ':id' kısmı herhangi bir sayı olabilir.
      // Örn: /movie/1, /movie/42, /movie/123
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetailView,
    },
  ],
})

export default router
