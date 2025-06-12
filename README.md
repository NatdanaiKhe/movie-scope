# MovieScope

MovieScope is a modern web application for discovering, browsing, and exploring movies. Built with React, TypeScript, and Vite, it provides a fast, responsive, and visually appealing interface for movie enthusiasts. MovieScope leverages the TMDB API to fetch up-to-date movie data, including trending, top-rated, and categorized movies, as well as detailed information for each film.

---

## Features

- **Home Page**: Showcases a featured movie, trending movies, top-rated movies, and lets users browse by category.
- **Movie Search**: Search for movies by title with instant results.
- **Movie Details**: View detailed information about a movie, including overview, genres, release date, director, revenue, cast, and trailer.
- **Movies Listing**: Browse all movies with pagination, filter by genre, and sort by popularity or rating.
- **Responsive Design**: Fully responsive layout for desktop and mobile devices.
- **Modern UI**: Built with Tailwind CSS for a clean, modern look.

---

## Tech Stack

- **React 18**
- **TypeScript**
- **Vite** (for fast development and build)
- **React Router DOM** (routing)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)
- **TMDB API** (movie data)

---

## Project Structure

```
├── public/           # Static assets (logo, etc.)
├── src/
│   ├── components/   # Reusable UI components (NavBar, MovieCard, etc.)
│   ├── layout/       # Main layout (NavBar, Footer, Outlet)
│   ├── pages/        # Page components (Home, Movies, Movie details)
│   ├── services/     # API service for TMDB
│   ├── types/        # TypeScript type definitions
│   ├── styles/       # Global and component styles
│   └── main.tsx      # App entry point
├── package.json      # Project metadata and dependencies
└── vite.config.ts    # Vite configuration

```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- TMDB API Key ([get one here](https://www.themoviedb.org/documentation/api))
---

## Usage
- **Browse** the home page for featured, trending, and top-rated movies.
- **Search** for any movie using the search bar in the navigation.
- **Click** on a movie card to view detailed information, including trailer and cast.
- **Browse by category** or use filters and pagination on the Movies page.

---

## License
This project is for educational and demonstration purposes only. Movie data is provided by [TMDB](https://www.themoviedb.org/).

---
