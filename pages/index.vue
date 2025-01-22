<template>
    <div :class="{ 'dark-mode': darkMode }" class="container">
      <h1 class="title"> NASA Universe Explorer</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/mars-photos">Mars Photos</NuxtLink>
        <NuxtLink to="/favorites">Favorites</NuxtLink>
      </nav>
      <button @click="toggleDarkMode" class="toggle-btn">
        {{ darkMode ? " Light Mode" : " Dark Mode" }}
      </button>
  
      <section class="apod">
        <h2>Astronomy Picture of the Day</h2>
  
        <!--  Date Range Picker -->
        <div class="date-range">
          <label>Select Date Range:</label>
          <input type="date" v-model="startDate" />
          <input type="date" v-model="endDate" />
          <button @click="fetchAPODs" class="gallery-btn">View</button>
        </div>
  
        <div v-if="loading" class="loading-spinner"></div>
        <div v-if="error" class="error-message">{{ error }}</div>
  
        <div v-if="apodMode">
          <!-- Single APOD View -->
          <transition name="fade">
            <div v-show="currentAPOD" class="apod-content">
              <NuxtLink v-if="currentAPOD?.url" :to="`/apod/${startDate}`">
                <img :src="currentAPOD.url" :alt="currentAPOD.title" class="apod-image" />
              </NuxtLink>
              <img v-else src="/restricted-access-placeholder.jpg" class="apod-placeholder" />
  
              <h3 class="apod-title">{{ currentAPOD?.title || "No Image Available" }}</h3>
              <p class="apod-explanation">{{ currentAPOD?.explanation || "NASA did not provide an image for this date." }}</p>
  
              <button v-if="currentAPOD" @click="toggleFavorite(currentAPOD)" class="favorite-btn">
                {{ isFavorite ? " Remove from Favorites" : " Add to Favorites" }}
              </button>
            </div>
          </transition>
        </div>
  
        <!-- Gallery View -->
        <div v-else>
          <transition-group name="fade">
            <div v-if="galleryAPODs.length > 0" class="gallery">
              <div v-for="apod in galleryAPODs" :key="apod.date" class="gallery-item">
                <NuxtLink v-if="apod?.url" :to="`/apod/${apod.date}`">
                  <img :src="apod.url" :alt="apod.title" class="gallery-image" />
                </NuxtLink>
                <img v-else src="/restricted-access-placeholder.jpg" class="gallery-placeholder" />
  
                <h3 class="gallery-title">{{ apod.title || "No Image Available" }}</h3>
                <p class="gallery-date">{{ apod.date }}</p>
              </div>
            </div>
            <p v-else class="no-results">No images found for this date range.</p>
          </transition-group>
        </div>
      </section>
    </div>
  </template>
  
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApodStore } from '@/store/useApodStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const apodStore = useApodStore();
const favoritesStore = useFavoritesStore();

// Date range filter for both single & gallery view
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]); 

const apodMode = ref(true); 
const galleryAPODs = ref([]);

const loading = computed(() => apodStore.loading);
const error = computed(() => apodStore.error);
const fetchAPOD = apodStore.fetchAPOD;
const toggleFavorite = favoritesStore.toggleFavorite;
const darkMode = ref(false);

const currentAPOD = computed(() => apodStore.apodCache[startDate.value] || apodStore.apod || null);

const isFavorite = computed(() => {
  return favoritesStore.favorites.some((fav) => fav.date === startDate.value);
});

const fetchAPODs = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Please select a valid date range.");
    return;
  }

  // Single APOD selection
  if (startDate.value === endDate.value) {
    apodMode.value = true;
    fetchAPOD(startDate.value);
    return;
  }

  // Selected date range 
  apodMode.value = false;
  try {
    loading.value = true;
    const config = useRuntimeConfig();
    const response = await $fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${config.public.nasaApiKey}&start_date=${startDate.value}&end_date=${endDate.value}`
    );
    galleryAPODs.value = response.reverse(); // Show latest images first
  } catch (err) {
    console.error("API Fetch Error:", err);
    error.value = "Failed to load APOD data.";
  } finally {
    loading.value = false;
  }
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

onMounted(() => {
  favoritesStore.loadFavoritesFromStorage();
  fetchAPOD(startDate.value);
});
</script>

  
 <style>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  text-align: center;
  background: linear-gradient(135deg, #1c1c2b, #2a0d45, #000e33);
  color: white;
  border-radius: 15px;
  padding: 20px;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: red;
  font-weight: bold;
  margin: 10px 0;
  text-align: center;
}

.date-range {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.date-range label {
  font-weight: bold;
  color: white;
}

.date-range input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  color: black;
}


.apod {
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.apod-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.apod-image:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  padding: 20px;
  max-width: 100%;
  margin: auto;
  justify-items: center;
}

.gallery-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.5);
}

.favorite-btn {
  margin-top: 10px;
  padding: 10px;
  background: linear-gradient(45deg, #ff3d00, #ff0000);
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
}

.favorite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0px 0px 10px rgba(255, 0, 0, 0.8);
}

.dark-mode {
  background: linear-gradient(135deg, #000000, #1a1a2e);
  color: #ffffff;
}

.dark-mode .apod {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.dark-mode .gallery-item {
  background: rgba(255, 255, 255, 0.15);
}

.dark-mode .date-range label {
  color: #ffcc00;
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

nav a {
  text-decoration: none;
  font-size: 1.2em;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

nav a {
  color: #ffcc00;
  background: rgba(0, 0, 0, 0.2);
}

nav a:hover {
  background: #ffcc00;
  color: #121212;
  box-shadow: 0px 0px 10px rgba(255, 204, 0, 0.8);
}

.dark-mode nav a {
  color: #00ccff;
  background: rgba(255, 255, 255, 0.2);
}

.dark-mode nav a:hover {
  background: #00ccff;
  color: #121212;
  box-shadow: 0px 0px 10px rgba(0, 204, 255, 0.8);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
