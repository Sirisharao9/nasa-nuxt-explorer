import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favoritesStore', {
  state: () => ({
    favorites: [],
  }),
  actions: {
    toggleFavorite(apod) {
      const index = this.favorites.findIndex((item) => item.date === apod.date);
      if (index === -1) {
        this.favorites.push(apod);
      } else {
        this.favorites.splice(index, 1);
      }
      this.saveFavorites();
    },
    removeFavorite(date) {
      this.favorites = this.favorites.filter((fav) => fav.date !== date);
      this.saveFavorites();
    },
    saveFavorites() {
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
