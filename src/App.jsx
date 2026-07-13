import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LiveMatches from './pages/LiveMatches';
import PreviousMatches from './pages/PreviousMatches';
import SeriesPage from './pages/SeriesPage';
import PlayersDirectory from './pages/PlayersDirectory';
import PlayerDetail from './pages/PlayerDetail';
import SportsScope from './pages/Home';
import CricketAnalytics from './pages/CricketAnalytics';

// Tennis Pages
import TennisHome from './pages/tennis/TennisHome';
import TennisMatches from './pages/tennis/TennisMatches';
import TennisTournaments from './pages/tennis/TennisTournaments';
import TennisRankings from './pages/tennis/TennisRankings';
import TennisPlayers from './pages/tennis/TennisPlayers';
import TennisAnalytics from './pages/tennis/TennisAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SportsScope />} />
        <Route path="/live" element={<LiveMatches />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/previous-matches" element={<PreviousMatches />} />
        <Route path="/players" element={<PlayersDirectory />} />
        <Route path="/player/:playerId" element={<PlayerDetail />} />
        <Route path="/analytics" element={<CricketAnalytics />} />

        {/* Tennis Routes */}
        <Route path="/tennis" element={<TennisHome />} />
        <Route path="/tennis/matches" element={<TennisMatches />} />
        <Route path="/tennis/tournaments" element={<TennisTournaments />} />
        <Route path="/tennis/rankings" element={<TennisRankings />} />
        <Route path="/tennis/players" element={<TennisPlayers />} />
        <Route path="/tennis/analytics" element={<TennisAnalytics />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
