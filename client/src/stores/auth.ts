// client/src/stores/auth.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // Tarayıcının local storage'ından token'ı okuyarak başlıyoruz.
  // Sayfa yenilense bile kullanıcının giriş yapmış kalmasını sağlar.
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null) // Kullanıcı bilgilerini saklamak için

  // --- GETTERS ---
  // State'ten türetilmiş veriler.
  const isAuthenticated = computed(() => !!token.value) // Token varsa kullanıcı giriş yapmıştır.

  // --- ACTIONS ---
  // State'i değiştiren fonksiyonlar.

  // Token'ı state'e ve local storage'a kaydeder.
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // Token'ı ve kullanıcıyı temizler (çıkış yapma).
  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  // KAYIT (REGISTER) AKSİYONU
  async function register(payload: any) {
    try {
      const response = await fetch('http://localhost:9090/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        // Hata mesajını backend'den alıp fırlat.
        throw new Error(data.errors ? data.errors[0].msg : data.msg || 'Registration failed')
      }
      // Kayıt başarılıysa, burada bir şey yapmamıza gerek yok, kullanıcıyı login sayfasına yönlendireceğiz.
      return data
    } catch (error) {
      console.error('Registration error in store:', error)
      throw error // Hatayı bileşenin yakalaması için tekrar fırlat.
    }
  }

  // GİRİŞ (LOGIN) AKSİYONU
  async function login(payload: any) {
    try {
      const response = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed')
      }

      // Başarılı girişte gelen token'ı kaydet.
      setToken(data.token)
      return data
    } catch (error) {
      console.error('Login error in store:', error)
      throw error
    }
  }

  // Store'dan dışarıya açtığımız her şey
  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    clearAuth,
  }
})
