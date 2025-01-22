<template>
    <div :class="{ 'dark-mode': darkMode }" class="container">
      <h1 class="title">Favorite APOD Images</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/mars-photos">Mars Photos</NuxtLink>
        <NuxtLink to="/favorites">Favorites</NuxtLink>
      </nav>
  
      <section v-if="favorites.length > 0" class="favorites-grid">
        <div v-for="fav in favorites" :key="fav.date" class="favorite-card">
          <NuxtLink :to="`/apod/${fav.date}`">
            <img :src="fav.url" :alt="fav.title" class="favorite-image" />
          </NuxtLink>
          <h3 class="fav-title">{{ fav.title }}</h3>
          <p class="fav-date">{{ fav.date }}</p>
          <button @click="removeFavorite(fav.date)" class="remove-btn">Remove</button>
        </div>
      </section>
      <p v-else>No favorites added yet.</p>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useFavoritesStore } from '@/store/useFavoritesStore';
  
  const favoritesStore = useFavoritesStore();
  const darkMode = computed(() => favoritesStore.darkMode);
  const favorites = computed(() => favoritesStore.favorites);
  
  const removeFavorite = (date) => {
    favoritesStore.removeFavorite(date);
  };
    
  onMounted(() => {
    favoritesStore.loadFavoritesFromStorage();
  });
  </script>
  
  <style>
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    padding: 20px 0;
  }
  
  .favorite-card {
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: fadeIn 1s forwards;
  }
  
  .favorite-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
    opacity: 0;
    animation: fadeIn 1s forwards;
  }
  
  .remove-btn {
    margin-top: 10px;
    padding: 8px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .fav-title, .fav-date {
    color: white; 
    font-weight: bold;
    text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.5); 
    margin-top: 8px;
  }
  
  .favorite-card {
    background: rgba(255, 255, 255, 0.15); 
    backdrop-filter: blur(10px);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }
  
  .remove-btn:hover {
    background-color: darkred;
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .dark-mode {
    background-color: #121212;
    color: #ffffff;
  }
  .dark-mode nav a {
    color: #ffffff;
  }
  </style>
  