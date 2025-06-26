// Dosya Yolu: client/src/stores/auth.ts (GÜNCELLENMİŞ HALİ)

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Gelen verilerin yapısını tanımlayan arayüzler (TypeScript için)
interface User {
  id: number
  email: string
  country: string
  city: string
}

interface Movie {
  id: number
  title: string
  posterUrl: string
  // ...diğer film bilgileri
}

export const useAuthStore = defineStore('auth', () => {
  // --- STATE (Değişkenler) ---
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  // YENİ STATE: Kullanıcının izleme listesini tutacak.
  // Bu bir dizi ve başlangıçta boş.
  const watchlist = ref<Movie[]>([])

  // --- GETTERS (Hesaplanan Değerler) ---
  const isAuthenticated = computed(() => !!token.value)

  // YENİ GETTER: Bir filmin izleme listesinde olup olmadığını kolayca kontrol etmek için.
  // Parametre olarak bir film ID'si alır ve true/false döner.
  const isInWatchlist = computed(() => {
    return (movieId: number) => watchlist.value.some((movie) => movie.id === movieId)
  })

  // --- ACTIONS (Fonksiyonlar) ---
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearAuth() {
    token.value = null
    user.value = null
    watchlist.value = [] // Çıkış yapıldığında izleme listesini de temizle
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
      // Giriş yaptıktan sonra hem kullanıcı bilgilerini hem de izleme listesini çek.
      await getUser()
      await fetchWatchlist() // YENİ

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

  // --- YENİ WATCHLIST ACTIONS ---

  // 1. İzleme listesini backend'den çeken fonksiyon
  async function fetchWatchlist() {
    if (!token.value) return // Token yoksa işlem yapma

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

  // 2. İzleme listesine film ekleyen fonksiyon
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

      // Başarılı olursa, listeyi yeniden çekerek güncel halini al.
      await fetchWatchlist()
    } catch (error) {
      console.error('Add to watchlist error:', error)
    }
  }

  // 3. İzleme listesinden film çıkaran fonksiyon
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

      // Başarılı olursa, listeyi yeniden çekerek güncel halini al.
      await fetchWatchlist()
    } catch (error) {
      console.error('Remove from watchlist error:', error)
    }
  }

  // Uygulama ilk yüklendiğinde hem kullanıcıyı hem de listesini çek
  // Bu, sayfa yenilendiğinde verilerin kaybolmamasını sağlar.
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
