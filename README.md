# SE 3355 - Web Development Final Project: IMDb Clone

This project is a fully functional web application developed as the final project for the SE 3355 Web Development course. It is a slimmed-down version of the popular movie database website, IMDb, incorporating its core features.

**Group:** Group 1
**Developer:** Emre Toklu

---

### 🎥 Project Demo Video

A short demonstration video showcasing the project's features and functionality is available at the link below:

**[Click Here for the Project Demo]** - https://www.youtube.com/watch?v=NECb_McAeSU

---

## 🛠️ Tech Stack

This project was built following the Service-Layered architecture principle, utilizing a modern and industry-standard technology stack.

### Frontend

*   **Framework:** Vue 3 (Composition API & `<script setup>`)
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **State Management:** Pinia
*   **Routing:** Vue Router
*   **Internationalization (i18n):** vue-i18n
*   **Charting:** Chart.js & vue-chartjs
*   **Slider/Carousel:** Swiper.js

### Backend

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **ORM (Object-Relational Mapping):** Sequelize
*   **Authentication:** JWT (JSON Web Tokens), Passport.js (for Google OAuth 2.0)
*   **File Uploads:** Multer
*   **Security:** bcrypt.js (Password Hashing), CORS

---

## ✨ Features

The application includes the following key features:

*   **Advanced Search:** Search by movie title, summary, and actor names.
    *   Filter search by category (e.g., Titles, People).
    *   Live search dropdown showing a maximum of 3 top results with images.
*   **Dynamic Home Page:** A "Featured Movies" section that is dynamically sorted based on a popularity score derived from user interactions.
*   **Internationalization:** Full support for English and Turkish, with the default language detected from the user's browser settings.
*   **User Authentication System:**
    *   Register and log in using email/password or a Google account.
    *   Secure password storage using BCrypt hashing.
    *   Optional profile picture upload during registration.
*   **Detailed Pages:** Rich detail pages for both movies and actors.
*   **User Interactions:**
    *   Ability to rate movies on a scale of 1-10 and write comments.
    *   Personalized watchlist functionality to add and remove movies.
*   **Data Visualization:**
    *   Interactive bar chart displaying a movie's rating distribution.
    *   Ability to filter the rating distribution by country.
*   **Popularity System:**
    *   A dynamic popularity score is calculated for each movie based on page views, number of ratings, and the overall IMDb score.
    *   A dedicated page to display movies ranked by their popularity.

---

## 📂 Data Model

The project is built upon 5 core models managed by Sequelize ORM in a PostgreSQL database:

1.  **User:** Stores user information, hashed passwords, and the profile photo URL.
2.  **Movie:** Contains movie details, trailer information, and popularity metrics (`viewCount`, `ratingCount`, `popularityScore`).
3.  **Actor:** Stores actor names and their image URLs.
4.  **Rating:** A table that holds the `score` and `comment` given by a `User` to a `Movie`.
5.  **Watchlist:** A join table that manages the Many-to-Many relationship between `User` and `Movie` for the watchlist feature.

### Relationships

*   `User` ↔ `Rating` (One-to-Many)
*   `Movie` ↔ `Rating` (One-to-Many)
*   `User` ↔ `Movie` (Many-to-Many, via `Watchlist` join table)
*   `Movie` ↔ `Actor` (Many-to-Many, via `MovieActors` join table)

---

## 🧠 Assumptions & Business Logic

*   **Popularity Score Formula:** The popularity of a movie is calculated in real-time based on the following formula:
    `Score = (viewCount * 1) + (ratingCount * 50) + (IMDb_rating * 10)`
    This formula assumes that a user rating is 50 times more valuable than a simple page view in determining popularity.
*   **Static Assets:** Static files such as actor images and movie posters are served from the `public` directories in both the `client` and `server` projects.

---

## 🚀 Setup and Installation

Follow these steps to run the project on a local machine.

### Prerequisites
*   Node.js (v18 or higher)
*   NPM
*   PostgreSQL

### Backend Setup
1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and provide your database credentials, JWT secret, etc.
4.  To populate the database with initial data, run: `node seed.js`
5.  (Optional) To scrape data from the IMDb Top 250, run: `node scraper.js`
6.  Start the server: `npm run dev`

### Frontend Setup
1.  Navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the application: `npm run dev`
4.  Open your browser and go to `http://localhost:5173`.

---

## 🔧 Problems Encountered & Solutions

*   **Database Truncate Error:** While running the `seed.js` script, a "foreign key constraint" error occurred. This was resolved by correcting the order of `destroy` commands and adding the `cascade: true` option to ensure that all related data in child tables was deleted before the parent tables were truncated.
*   **Model & DB Schema Mismatch:** After adding a new column (e.g., `imageUrl`) to a model, the `seed.js` script would fail with a "column does not exist" error. The root cause was that the `sequelize.sync` command, which updates the schema, was not being triggered before the seed script ran. The solution was to run the main server (`index.js`) once to allow the schema to update, and then run the seed script.
*   **File Path Errors (`MODULE_NOT_FOUND`):** Errors related to module resolution occurred due to incorrect relative paths when running scripts from the terminal. This was fixed by ensuring commands were run with the correct paths relative to the current working directory (e.g., using `node seed.js` inside the `server` directory instead of `node server/seed.js`).

Frontend: https://imdb-clone-theta-woad.vercel.app/

Backend: https://imdb-l6w1.onrender.com/
