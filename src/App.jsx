import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LiveMatches from './pages/LiveMatches';
import PreviousMatches from './pages/PreviousMatches';
import SeriesPage from './pages/SeriesPage';
import PlayersDirectory from './pages/PlayersDirectory';
import PlayerDetail from './pages/PlayerDetail';
import SportsScope from './pages/Home';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
