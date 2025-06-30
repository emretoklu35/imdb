import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  country: string
  city: string
  firstName: string
  lastName: string
}

interface Movie {
  id: number
  title: string
  posterUrl: string
}

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const watchlist = ref<Movie[]>([])

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value)
  const isInWatchlist = computed(() => {
    return (movieId: number) => watchlist.value.some((movie) => movie.id === movieId)
  })

  // --- ACTIONS ---
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearAuth() {
    token.value = null
    user.value = null
    watchlist.value = []
    localStorage.removeItem('token')
  }

  async function login(payload: any) {
    try {
      const response = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.msg || 'Login failed')

      setToken(data.token)
      await getUser()
      await fetchWatchlist()

      return data
    } catch (error) {
      console.error('Login error in store:', error)
      throw error
    }
  }

  async function getUser() {
    if (!token.value) return

    try {
      const response = await fetch('http://localhost:9090/api/auth/me', {
        headers: { 'x-auth-token': token.value },
      })
      if (!response.ok) throw new Error('Failed to fetch user')
      user.value = await response.json()
    } catch (error) {
      console.error('Get user error:', error)
      clearAuth()
    }
  }

  async function fetchWatchlist() {
    if (!token.value) return

    try {
      const response = await fetch('http://localhost:9090/api/watchlist', {
        headers: { 'x-auth-token': token.value },
      })
      if (!response.ok) throw new Error('Failed to fetch watchlist')
      watchlist.value = await response.json()
    } catch (error) {
      console.error('Fetch watchlist error:', error)
    }
  }

  async function addToWatchlist(movieId: number) {
    if (!token.value) return

    try {
      const response = await fetch('http://localhost:9090/api/watchlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token.value,
        },
        body: JSON.stringify({ movieId }),
      })
      if (!response.ok) throw new Error('Failed to add to watchlist')
      await fetchWatchlist()
    } catch (error) {
      console.error('Add to watchlist error:', error)
    }
  }

  async function removeFromWatchlist(movieId: number) {
    if (!token.value) return

    try {
      const response = await fetch('http://localhost:9090/api/watchlist/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token.value,
        },
        body: JSON.stringify({ movieId }),
      })
      if (!response.ok) throw new Error('Failed to remove from watchlist')
      await fetchWatchlist()
    } catch (error) {
      console.error('Remove from watchlist error:', error)
    }
  }

  if (token.value) {
    getUser()
    fetchWatchlist()
  }

  return {
    token,
    user,
    watchlist,
    isAuthenticated,
    isInWatchlist,
    login,
    clearAuth,
    getUser,
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  }
})
