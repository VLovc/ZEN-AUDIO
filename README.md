# 🎵 ZEN AUDIO

A modern full-stack music streaming web application built with React, Tailwind CSS v4, Node.js (Express), and MongoDB Atlas.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React (Vite template)
- **Styling:** Tailwind CSS v4 (using `@theme` directives)
- **State Management & Icons:** Lucide React, CSS Transitions & Animations

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Mongoose
- **Tooling:** Nodemon (for development hot reload), Cors, Dotenv

### Database
- **Database:** MongoDB Atlas (Cloud)

---

## 📂 Project Structure

```text
Kaketsu Music/
├── frontend/             # React Frontend (Vite)
│   ├── src/
│   │   ├── components/   # UI & Layout components (Auth, PlayerBar, etc.)
│   │   ├── App.jsx
│   │   ├── index.css     # Global CSS with Tailwind CSS v4 theme config
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── backend/              # Node.js Backend
    ├── src/
    │   ├── models/       # Mongoose Schemas (Playlist, Track, User)
    │   └── middlewares/  # Express Middlewares (authMiddleware)
    ├── .env              # Environment variables configuration
    ├── server.js         # Entry point for backend Express app
    └── package.json
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- A MongoDB Atlas Account

### Backend Installation & Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. Rename/create `.env` and fill in your MongoDB connection string and server port:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kaketsu_music?retryWrites=true&w=majority
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The server should run on `http://localhost:5000` and display "Connected to MongoDB".*

### Frontend Installation & Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client will be running on `http://localhost:5173`.*

---

## 🌟 Key Features
- **Modern User Interface:** Highly custom design system with custom colors and glassmorphism panel design.
- **Music Playback Control:** Dynamic player bar with state management.
- **Authentication:** Register and login features for users.
- **Playlists & Library:** Manage custom playlists and tracks using MongoDB.

---

## 📝 License
This project is licensed under the ISC License.


# App-music 
