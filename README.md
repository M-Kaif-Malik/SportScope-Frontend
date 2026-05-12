# SportScope Frontend

SportScope Frontend is a React-based sports platform for browsing live sports data, historical matches, player information, rankings, tournaments, and series details.

The frontend communicates with the SportScope Backend API to display real-time and historical sports data for cricket and tennis.

---

# Features

## Cricket Features

* Live match tracking
* Upcoming matches
* Historical/saved matches
* Cricket series browsing
* Player directory
* Advanced player filtering
* Player detail pages

## Tennis Features

* ATP/WTA fixtures
* Tournament calendar
* Rankings
* Tennis player search

## UI Features

* Responsive interface
* Dynamic routing
* Live polling updates
* Reusable component architecture
* Filter and search support

---

# Tech Stack

* React 19
* React Router
* Vite
* TailwindCSS
* Axios

---

# Architecture Overview

```text
React Frontend
      ↓
Express Backend API
      ↓
MongoDB + External Sports APIs
```

---

# Screenshots

Add screenshots of your application here.

Example:

```md
![Home Page](./screenshots/home.png)
![Live Matches](./screenshots/live.png)
![Players](./screenshots/players.png)
```

---

# Project Structure

```text
SportScope-Frontend/
│
├── public/
├── src/
│   ├── assets/        # Images/icons
│   ├── components/    # Reusable UI components
│   ├── constants/     # Static datasets
│   ├── pages/         # Route-level pages
│   ├── services/      # API wrappers
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>
cd SportScope-Frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal.

Typically:

```text
http://localhost:5173
```

---

# Build for Production

```bash
npm run build
```

---

# Lint

```bash
npm run lint
```

---

# Backend Requirement

The frontend expects the backend API server to run at:

```text
http://localhost:5000
```

Ensure the backend server is running before using the frontend application.

---

# App Routes

## Main Routes

| Route               | Description              |
| ------------------- | ------------------------ |
| `/`                 | Home page                |
| `/live`             | Live matches             |
| `/series`           | Cricket series           |
| `/previous-matches` | Historical/saved matches |
| `/players`          | Player directory         |
| `/player/:playerId` | Player details           |

---

# Tennis Routes

| Route                 | Description         |
| --------------------- | ------------------- |
| `/tennis`             | Tennis home         |
| `/tennis/matches`     | Tennis fixtures     |
| `/tennis/tournaments` | Tournament calendar |
| `/tennis/rankings`    | Rankings            |
| `/tennis/players`     | Tennis players      |

---

# API Usage

The frontend consumes REST APIs provided by the SportScope Backend.

---

# Main API Endpoints Used

## Matches

```http
GET /api/matches/live
GET /api/matches/upcoming
GET /api/matches/saved
```

---

## Series

```http
GET /api/series/upcoming
GET /api/series/:seriesId
```

---

## Players

Handled through:

```text
src/services/playerApi.js
```

---

## Tennis

Handled through:

```text
src/services/tennisApi.js
```

---

# Live Polling

The live matches page refreshes data every:

```text
30 seconds
```

This helps keep match information updated without requiring manual refreshes.

---

# Data Structure Expectations

Many UI pages expect match data in structures similar to:

```js
{
  teamA: {},
  teamB: {},
  score: [],
}
```

Player pages commonly use:

```js
playerId
```

for routing and fetching details.

---

# Design Approach

The frontend is structured around:

* Reusable components
* Route-level pages
* API abstraction services
* Dynamic rendering
* Sports-specific filtering

The application separates:

* UI components
* API communication
* Page routing
* Static datasets

to maintain scalability and organization.

---

# Current Limitations

* Real-time updates use polling instead of WebSockets
* UI analytics visualizations are limited
* Some data depends on third-party API availability
* API rate limits may affect live updates

---

# Future Improvements

Potential future enhancements include:

* Advanced sports analytics dashboards
* Charts and visualizations
* Real-time WebSocket updates
* User authentication
* Favorites/watchlists
* Team comparison tools
* Mobile optimization improvements
* Additional sports support

---

# Deployment (Planned)

## Frontend Hosting

* Vercel
* Netlify

## Backend Hosting

* Render
* Railway

## Database

* MongoDB Atlas

---

# License

Add your preferred license here if applicable.
