<template>
    <div class="container">
      <h1 class="title">Mars Rover Photos</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/mars-photos">Mars Photos</NuxtLink>
        <NuxtLink to="/favorites">Favorites</NuxtLink>
      </nav>
      
      <select v-model="selectedRover" @change="fetchCameras">
        <option v-for="rover in rovers" :key="rover.id" :value="rover.name.toLowerCase()">
          {{ rover.name }}
        </option>
      </select>
      <select v-if="availableCameras.length" v-model="selectedCamera">
        <option value="">All Cameras</option>
        <option v-for="camera in availableCameras" :key="camera.id" :value="camera.name">
          {{ camera.full_name }}
        </option>
      </select>
      <button @click="fetchMarsPhotos">Load Photos</button>
      <div v-if="loading">Loading Mars Photos...</div>
      <section v-else class="rover-photos">
        <div v-if="roverPhotos.length" class="photo-grid">
          <div v-for="photo in roverPhotos" :key="photo.id" class="photo-card">
            <img :src="photo.img_src" :alt="`Photo taken by ${photo.rover.name}`" class="rover-image" @error="handleImageError" />
            <p>{{ photo.rover.name }} - {{ photo.camera.full_name }}</p>
          </div>
        </div>
        <p v-else>No photos found for this selection.</p>
      </section>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed, ref } from 'vue';
  import { useImageStore } from '@/store/imageStore';
  
  const store = useImageStore();
  const { fetchRovers, fetchMarsPhotos } = store;
  const roverPhotos = computed(() => store.roverPhotos);
  const rovers = computed(() => store.rovers);
  const selectedRover = ref(store.selectedRover);
  const selectedCamera = ref(store.selectedCamera);
  const loading = computed(() => store.loading);
  const availableCameras = ref([]);
  
  const fetchCameras = () => {
    const rover = rovers.value.find(r => r.name.toLowerCase() === selectedRover.value);
    availableCameras.value = rover ? rover.cameras : [];
  };
  
  const handleImageError = (event) => {
    event.target.src = '/restricted-access-placeholder.jpg';
  };
  
  onMounted(() => {
    fetchRovers();
    fetchMarsPhotos();
  });
  </script>
  
  <style>
  .container {
    max-width: 900px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  
  nav {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  nav a {
    text-decoration: none;
    color: #ffcc00;
    font-size: 1.2em;
    font-weight: bold;
  }
  
  select {
    padding: 8px;
    margin: 10px;
  }
  
  button {
    padding: 10px;
    background-color: #007acc;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    padding: 20px 0;
  }
  
  .photo-card {
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .rover-image {
    max-width: 100%;
    border-radius: 8px;
  }
  
  .loading {
    font-size: 1.2em;
    color: #888;
  }
  </style>
  