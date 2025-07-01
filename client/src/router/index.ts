import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import WatchlistView from '../views/WatchListView.vue'
import AuthCallbackView from '../views/AuthCallback.vue'
import VideoPlayerView from '../views/VideoPlayerView.vue'
import ActorDetailView from '../views/ActorDetailView.vue'
import PopularMoviesView from '../views/PopularMoviesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: AuthView },
    { path: '/register', name: 'register', component: AuthView },
    { path: '/search/results', name: 'search-results', component: SearchResultsView },
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView, props: true },
    { path: '/watchlist', name: 'watchlist', component: WatchlistView },
    { path: '/auth/callback', name: 'auth-callback', component: AuthCallbackView },
    { path: '/video/:videoId', name: 'video-player', component: VideoPlayerView, props: true },
    { path: '/actor/:id', name: 'actor-detail', component: ActorDetailView, props: true },

    {
      path: '/movies/popular',
      name: 'popular-movies',
      component: PopularMoviesView,
    },
  ],
})

export default router
