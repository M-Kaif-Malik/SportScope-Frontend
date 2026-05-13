import API_BASE_URL from "../config/api";

const ANALYTICS_API_BASE_URL = `${API_BASE_URL}/api/analytics`;

// Cricket Analytics
export const fetchCricketTopTeams = async (limit = 10) => {
    try {
        const response = await fetch(`${ANALYTICS_API_BASE_URL}/cricket/top-teams?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch cricket top teams');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false, teams: [] };
    }
};

export const fetchCricketRecentMatches = async (limit = 10) => {
    try {
        const response = await fetch(`${ANALYTICS_API_BASE_URL}/cricket/recent-matches?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch recent cricket matches');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false, matches: [] };
    }
};

export const fetchCricketPlayersByCountry = async (limit = 10) => {
    try {
        const response = await fetch(`${ANALYTICS_API_BASE_URL}/cricket/players-by-country?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch cricket players by country');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false, countries: [] };
    }
};

// Tennis Analytics
export const fetchTennisTopRanked = async (type = 'atp', limit = 10) => {
    try {
        const response = await fetch(`${ANALYTICS_API_BASE_URL}/tennis/top-ranked/${type}?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch tennis top ranked');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false, players: [] };
    }
};

export const fetchTennisTopTournaments = async (limit = 10) => {
    try {
        const response = await fetch(`${ANALYTICS_API_BASE_URL}/tennis/top-tournaments?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch tennis top tournaments');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { success: false, tournaments: [] };
    }
};
