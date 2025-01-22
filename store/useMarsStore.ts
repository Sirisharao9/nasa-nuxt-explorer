import { defineStore } from 'pinia';

export const useMarsStore = defineStore('marsStore', {
  state: () => ({
    roverPhotos: [],
    rovers: [],
    selectedRover: 'curiosity',
    selectedCamera: '',
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRovers() {
      try {
        const config = useRuntimeConfig();
        const response = await $fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${config.public.nasaApiKey}`
        );
        this.rovers = response.rovers;
      } catch (err) {
        console.error("API Fetch Error (Rovers):", err);
        this.error = "Failed to load rover data.";
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
    }
  }
});
