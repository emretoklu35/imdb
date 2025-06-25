<!-- client/src/components/Navbar.vue -->

<template>
  <header class="navbar">
    <div class="navbar-left">
      <!-- Logo -->
      <router-link to="/" class="logo">IMDb</router-link>
      <!-- Menü -->
      <div class="menu">☰ Menu</div>
    </div>

    <div class="navbar-center">
      <!-- Arama Çubuğu -->
      <div class="search-bar">
        <select>
          <option>All</option>
        </select>
        <input type="text" placeholder="Search IMDb" />
        <button>🔍</button>
      </div>
    </div>

    <div class="navbar-right">
      <!-- Watchlist -->
      <div class="watchlist">+ Watchlist</div>

      <!-- GİRİŞ YAP LİNKİ GÜNCELLENDİ -->
      <!-- 'div' yerine 'router-link' kullanarak /login sayfasına yönlendirme yapıyoruz. -->
      <router-link to="/login" class="auth">Sign In</router-link>

      <!-- Dil Seçeneği -->
      <div class="language">
        <select>
          <option>EN</option>
          <option>TR</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Şimdilik script kısmı boş kalacak.
// Kullanıcı giriş yaptığında Navbar'ı güncellemek için burayı kullanacağız.
</script>

<style scoped>
/* Bu bileşene özel CSS stilleri */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #121212;
  color: white;
  padding: 10px 20px;
  font-family: sans-serif;
}
.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px; /* Elemanlar arası boşluk */
}
.logo {
  font-weight: bold;
  font-size: 24px;
  color: #f5c518; /* IMDb sarısı */
  text-decoration: none; /* RouterLink'in alt çizgisini kaldır */
}
.search-bar {
  display: flex;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}
.search-bar input {
  border: none;
  padding: 8px;
  outline: none;
  width: 400px;
}
.search-bar select,
.search-bar button {
  border: none;
  background-color: #f0f0f0;
  padding: 8px;
}
.language select {
  background-color: #121212;
  color: white;
  border: none;
}

/* YENİ EKLENEN STİL */
.auth {
  color: white;
  text-decoration: none; /* RouterLink'in alt çizgisini kaldır */
  font-size: 16px;
  font-weight: bold;
}
.auth:hover {
  color: #f5c518; /* Üzerine gelince sarı olsun */
}
</style>
