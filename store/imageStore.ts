import { defineStore } from 'pinia';

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    apodCache: {}, // Storing fetched APOD images by date
    apod: null,
    roverPhotos: [],
    rovers: [],
    selectedRover: 'curiosity',
    selectedCamera: '',
    loading: false,
    error: null, 
    darkMode: false,
    favorites: [],
  }),
  actions: {
    async fetchAPOD(date = '') {
      try {
        this.loading = true;
        this.error = null; 

        if (this.apodCache[date]) {
          this.apod = this.apodCache[date];
          return;
        }

        const config = useRuntimeConfig();
        const response = await $fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${config.public.nasaApiKey}&date=${date}`
        );

        this.apod = response;
        this.apodCache[date] = response; 
      } catch (err) {
        console.error("API Fetch Error (APOD):", err);
        this.error = "Failed to load APOD. Please try another date.";
      } finally {
        this.loading = false;
      }
    },
    async fetchRovers() {
      try {
        this.loading = true;
        this.error = null;

        const config = useRuntimeConfig();
        const response = await $fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${config.public.nasaApiKey}`
        );

        this.rovers = response.rovers;
      } catch (err) {
        console.error("API Fetch Error (Rovers):", err);
        this.error = "Failed to load rover data.";
      } finally {
        this.loading = false;
      }
    },
    async fetchMarsPhotos(rover = 'curiosity', camera = '', sol = 1000) {
      try {
        this.loading = true;
        this.error = null;

        this.selectedRover = rover;
        this.selectedCamera = camera;
        const config = useRuntimeConfig();
        let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${config.public.nasaApiKey}`;
        
        if (camera) {
          apiUrl += `&camera=${camera}`;
        }

        const response = await $fetch(apiUrl);
        this.roverPhotos = response.photos;
      } catch (err) {
        console.error("API Fetch Error (Mars Photos):", err);
        this.error = "Failed to load Mars photos. Try a different rover or camera.";
      } finally {
        this.loading = false;
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    toggleFavorite(apod) {
      const index = this.favorites.findIndex((item) => item.date === apod.date);
      if (index === -1) {
        this.favorites.push(apod);
      } else {
        this.favorites.splice(index, 1); 
      }

      if (process.client) {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      }
    },
    loadFavoritesFromStorage() {
      if (process.client) {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          this.favorites = JSON.parse(storedFavorites);
        }
      }
    },
  },
});
