const API_BASE_URL = 'http://localhost:5000/api';

export const fetchPlayers = async ({ 
    page = 1, 
    limit = 8, 
    search = "", 
    country = "", // This is countryId
    position = "", 
    gender = "", 
    battingStyle = "", 
    bowlingStyle = "", 
    sort = "playerId", 
    order = "asc" 
}) => {
    // Build query params
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q: search,
        sortBy: sort,
        order: order
    });

    if (country) params.append('countryId', country);
    if (position) params.append('position', position);
    if (gender) params.append('gender', gender);
    if (battingStyle) params.append('battingStyle', battingStyle);
    if (bowlingStyle) params.append('bowlingStyle', bowlingStyle);

    try {
        const response = await fetch(`${API_BASE_URL}/players?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch players');
        return await response.json();
    } catch (err) {
        console.error(err);
        return { count: 0, page, limit, players: [] };
    }
};

export const fetchFilters = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/players/filters`);
        if (!response.ok) throw new Error('Failed to fetch filters');
        const data = await response.json();
        
        // Transform filters to match frontend expected structure
        return {
            genders: data.genders.map(g => ({ id: g, label: g === 'm' ? 'Male' : 'Female' })),
            battingStyles: data.battingStyles.map(s => ({ id: s, label: s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) })),
            bowlingStyles: data.bowlingStyles.map(s => ({ id: s ? s : 'none', label: s ? s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'None / N/A' })),
            positions: data.positions.map(p => ({ id: p, label: p })),
            countries: data.countries.map(c => ({ id: c.id, label: c.name, flag: c.image })) // backend returns array of { id, name, image, continent }
        };
    } catch (err) {
        console.error(err);
        return {
            genders: [], battingStyles: [], bowlingStyles: [], positions: [], countries: []
        };
    }
};

export const fetchPlayerById = async (playerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/players/id/${playerId}`);
        if (!response.ok) throw new Error('Failed to fetch player');
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
