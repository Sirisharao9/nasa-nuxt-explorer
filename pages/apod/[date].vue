<template>
    <div :class="{ 'dark-mode': darkMode }" class="container">
      <h1 class="title">APOD Details</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/mars-photos">Mars Photos</NuxtLink>
        <NuxtLink to="/favorites">Favorites</NuxtLink>
      </nav>
  
      <div v-if="loading" class="loading">Loading APOD details...</div>
      <div v-else-if="apod" class="apod-content">
        <img :src="apod.hdurl || apod.url" :alt="apod.title" class="apod-image-large" />
        <h2>{{ apod.title }}</h2>
        <p><strong>Date:</strong> {{ date }}</p>
        <p>{{ apod.explanation }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { onMounted, computed, ref } from 'vue';
  import { useImageStore } from '@/store/imageStore';
  
  const route = useRoute();
  const store = useImageStore();
  const loading = computed(() => store.loading);
  const apodCache = computed(() => store.apodCache);
  const fetchAPOD = store.fetchAPOD;
  const date = ref(route.params.date);
  const apod = computed(() => apodCache.value[date.value]);
  
  onMounted(() => {
    fetchAPOD(date.value);
  });
  </script>
  
  <style>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  
  .apod-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .apod-image-large {
    max-width: 90%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  /* Dark Mode Styles */
  .dark-mode {
    background-color: #121212;
    color: #ffffff;
  }
  .dark-mode nav a {
    color: #ffffff;
  }
  </style>
  