# Sports Analytics Web App - Frontend

This is the frontend repository for the Sports Analytics Web App, built with React and Vite. It provides a comprehensive, responsive, and interactive user interface for displaying sports analytics, currently focusing on Cricket and Tennis.

## Features

- **Cricket Module:** View live, recent, and upcoming cricket matches, player profiles, and detailed series information.
- **Tennis Module:** Explore tennis fixtures (by date, range, or tournament), player profiles and stats, tournament calendars, and rankings (singles, doubles, race).
- **Modern UI:** Built with Tailwind CSS for a responsive, sleek, and premium user experience.
- **Client-Side Routing:** Utilizes React Router for seamless navigation between different sports modules and pages.
- **Dynamic Data Visualization:** Uses data fetched from the backend API to display real-time analytics.

## Technologies Used

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd f2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be running on `http://localhost:5173` (or the port specified by Vite).

### Building for Production

To build the app for production, run:
```bash
npm run build
```
This will generate optimized static assets in the `dist` folder.

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

- `src/components`: Reusable UI components (like the `SeriesCard`, headers, layouts).
- `src/pages`: Top-level page components for different routes.
- `src/assets`: Static assets like images and global CSS.

## License

This project is licensed under the MIT License.
