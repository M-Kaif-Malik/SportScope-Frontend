import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/tennis';

// --- Fixtures ---
export const getTodayFixtures = async (type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/fixtures/today?type=${type}`);
    return response.data;
};

export const getFixturesByDate = async (date, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/fixtures/date/${date}?type=${type}`);
    return response.data;
};

export const getFixturesByRange = async (start, end, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/fixtures/range?start=${start}&end=${end}&type=${type}`);
    return response.data;
};

export const getFixturesByTournament = async (tournamentId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/fixtures/tournament/${tournamentId}?type=${type}`);
    return response.data;
};

export const getFixturesByPlayer = async (playerId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/fixtures/player/${playerId}?type=${type}`);
    return response.data;
};

export const getCompletedFixtures = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`${BASE_URL}/fixtures/db/completed?${query}`);
    return response.data;
};

// --- Players ---
export const searchPlayers = async (name, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/players/search/${name}?type=${type}`);
    return response.data;
};

export const getPlayerProfile = async (playerId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/players/${type}/${playerId}`);
    return response.data;
};

export const getPlayerMatches = async (playerId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/players/${type}/${playerId}/matches`);
    return response.data;
};

export const getPlayerStats = async (playerId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/players/${type}/${playerId}/stats`);
    return response.data;
};

export const getPlayerTitles = async (playerId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/players/${type}/${playerId}/titles`);
    return response.data;
};

// --- Tournaments ---
export const getTournamentCalendar = async (year, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/tournaments/calendar/${year}?type=${type}`);
    return response.data;
};

export const getTournamentInfo = async (tournamentId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/tournaments/info/${tournamentId}?type=${type}`);
    return response.data;
};

export const getTournamentResults = async (tournamentId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/tournaments/results/${tournamentId}?type=${type}`);
    return response.data;
};

export const getPastChampions = async (tournamentId, type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/tournaments/past-champions/${tournamentId}?type=${type}`);
    return response.data;
};

// --- Rankings ---
export const getSinglesRankings = async (type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/rankings/${type}/singles`);
    return response.data;
};

export const getDoublesRankings = async (type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/rankings/${type}/doubles`);
    return response.data;
};

export const getRaceRankings = async (type = 'atp') => {
    const response = await axios.get(`${BASE_URL}/rankings/${type}/race`);
    return response.data;
};
