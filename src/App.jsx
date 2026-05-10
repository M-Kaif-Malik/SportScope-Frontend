import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LiveMatches from './pages/LiveMatches';
import PreviousMatches from './pages/PreviousMatches';
import SeriesPage from './pages/SeriesPage';
import PlayersDirectory from './pages/PlayersDirectory';
import PlayerDetail from './pages/PlayerDetail';
import SportsScope from './pages/Home';

// Tennis Pages
import TennisHome from './pages/tennis/TennisHome';
import TennisMatches from './pages/tennis/TennisMatches';
import TennisTournaments from './pages/tennis/TennisTournaments';
import TennisRankings from './pages/tennis/TennisRankings';
import TennisPlayers from './pages/tennis/TennisPlayers';

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

        {/* Tennis Routes */}
        <Route path="/tennis" element={<TennisHome />} />
        <Route path="/tennis/matches" element={<TennisMatches />} />
        <Route path="/tennis/tournaments" element={<TennisTournaments />} />
        <Route path="/tennis/rankings" element={<TennisRankings />} />
        <Route path="/tennis/players" element={<TennisPlayers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
