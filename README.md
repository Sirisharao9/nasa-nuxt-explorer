# NASA Universe Explorer - Nuxt 3

A Nuxt 3 project that fetches NASA's Astronomy Picture of the Day (APOD) and Mars Rover photos using NASA's public API. Users can toggle dark mode, add images to favorites, and explore past images with a date range filter.

## Features
1. Fetches NASA's APOD & Mars Rover images  
2. Supports date selection & range filtering  
3. Favorites system with local storage  
4. Dark Mode Toggle  
5. Server-Side Rendering (SSR) enabled  
6. Fully responsive UI with smooth animations  

##  Installation & Setup

1. Clone the Repository
```bash
git clone https://github.com/Sirisharao9/nasa-nuxt-explorer.git
cd nasa-nuxt-explorer

2. Install Dependencies
npm install

3. Create an .env File
Create a .env file to store your NASA API Key.
touch .env

Inside .env, add:
NUXT_PUBLIC_NASA_API_KEY=your_nasa_api_key
:Get an API Key from NASA API.

4. Start the Development Server
npm run dev

Tech Stack
Nuxt 3 (Vue.js framework)
Pinia (State Management)
NASA API (APOD & Mars Rover)
TailwindCSS (Styling)
FontAwesome (Icons)
Vite (Bundler)