import { defineStore } from 'pinia';

export const useApodStore = defineStore('apodStore', {
  state: () => ({
    apodCache: {}, // Storing cached APOD data by date
    apod: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAPOD(date = '') {
      try {
        this.loading = true;
        this.error = null;

        // Checking if the APOD data is already cached
        if (this.apodCache[date]) {
          console.log(`Loading APOD from cache: ${date}`);
          this.apod = this.apodCache[date];
          return;
        }

        // Checking localStorage cache
        if (process.client) {
          const cachedData = localStorage.getItem(`apod-${date}`);
          if (cachedData) {
            console.log(`Loading APOD from localStorage: ${date}`);
            this.apod = JSON.parse(cachedData);
            this.apodCache[date] = this.apod; 
            return;
          }
        }

        // Fetching from API if not cached
        console.log(`Fetching APOD from API: ${date}`);
        const config = useRuntimeConfig();
        const response = await $fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${config.public.nasaApiKey}&date=${date}`
        );

        this.apod = response;
        this.apodCache[date] = response; 

        // Saving response to localStorage
        if (process.client) {
          localStorage.setItem(`apod-${date}`, JSON.stringify(response));
        }
      } catch (err) {
        console.error("API Fetch Error (APOD):", err);
        this.error = "Failed to load APOD. Please try another date.";
      } finally {
        this.loading = false;
      }
    }
  }
});
