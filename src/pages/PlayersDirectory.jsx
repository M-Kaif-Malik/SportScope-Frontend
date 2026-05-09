import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { fetchPlayers, fetchFilters } from '../services/playerApi';

// Custom debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function PlayersDirectory() {
    const navigate = useNavigate();

    // State
    const [players, setPlayers] = useState([]);
    const [filtersMetadata, setFiltersMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 400);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        country: '',
        gender: '',
        battingStyle: '',
        bowlingStyle: '',
        position: ''
    });

    useEffect(() => {
        fetchFilters().then(data => setFiltersMetadata(data));
    }, []);

    useEffect(() => {
        loadPlayers();
    }, [debouncedSearch, filters, page]);

    const loadPlayers = async () => {
        setLoading(true);
        try {
            const res = await fetchPlayers({
                search: debouncedSearch,
                ...filters,
                page: page,
                limit: 8
            });
            setPlayers(res.players);
            setTotalPages(Math.ceil(res.count / res.limit));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilters({
            country: '',
            gender: '',
            battingStyle: '',
            bowlingStyle: '',
            position: ''
        });
        setPage(1);
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />

            <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[112px] mt-6">
                {/* Search and Filter Shell */}
                <section className="py-12 border-t border-[var(--color-outline-variant)]/10">
                    <div className="flex flex-col gap-6 mb-12">
                        <div>
                            <h2 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)] mb-4">Search Players</h2>
                            <div className="relative group max-w-2xl">
                                <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-secondary)] transition-colors" />
                                <input
                                    className="w-full bg-[var(--color-surface-container-low)] border-b-2 border-[var(--color-outline-variant)] focus:border-[var(--color-secondary)] focus:ring-0 px-12 py-4 font-manrope text-[16px] leading-[1.6] transition-all outline-none"
                                    placeholder="Search by ID or name...."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap gap-4 bg-[var(--color-surface-container-lowest)] p-6 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                            <select
                                value={filters.country}
                                onChange={(e) => handleFilterChange('country', e.target.value)}
                                className="px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg font-manrope text-[14px] border border-[var(--color-outline-variant)] outline-none focus:border-[var(--color-secondary)] cursor-pointer"
                            >
                                <option value="">All Countries</option>
                                {filtersMetadata?.countries.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>

                            <select
                                value={filters.position}
                                onChange={(e) => handleFilterChange('position', e.target.value)}
                                className="px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg font-manrope text-[14px] border border-[var(--color-outline-variant)] outline-none focus:border-[var(--color-secondary)] cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                {filtersMetadata?.positions.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>

                            <select
                                value={filters.gender}
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                                className="px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg font-manrope text-[14px] border border-[var(--color-outline-variant)] outline-none focus:border-[var(--color-secondary)] cursor-pointer"
                            >
                                <option value="">All Genders</option>
                                {filtersMetadata?.genders.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                            </select>

                            <select
                                value={filters.battingStyle}
                                onChange={(e) => handleFilterChange('battingStyle', e.target.value)}
                                className="px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg font-manrope text-[14px] border border-[var(--color-outline-variant)] outline-none focus:border-[var(--color-secondary)] cursor-pointer"
                            >
                                <option value="">All Batting Styles</option>
                                {filtersMetadata?.battingStyles.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                            </select>

                            <select
                                value={filters.bowlingStyle}
                                onChange={(e) => handleFilterChange('bowlingStyle', e.target.value)}
                                className="px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg font-manrope text-[14px] border border-[var(--color-outline-variant)] outline-none focus:border-[var(--color-secondary)] cursor-pointer"
                            >
                                <option value="">All Bowling Styles</option>
                                {filtersMetadata?.bowlingStyles.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                            </select>

                            {/* Reset Button */}
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 ml-auto rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase hover:bg-[var(--color-secondary)] hover:text-[var(--color-on-secondary)] transition-colors cursor-pointer border-none"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Bento Grid of Players */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] rounded-xl bg-[var(--color-surface-container)] mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-[var(--color-surface-container-high)] rounded"></div>
                                        <div className="h-6 w-3/4 bg-[var(--color-surface-container-high)] rounded"></div>
                                        <div className="h-4 w-1/2 bg-[var(--color-surface-container-high)] rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : players.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)] mb-4">No players found</h3>
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 rounded-full bg-[var(--color-secondary)] text-[var(--color-on-secondary)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase border-none cursor-pointer"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {players.map(player => (
                                <div key={player.playerId} className="group cursor-pointer" onClick={() => navigate(`/player/${player.playerId}`)}>
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 border border-[var(--color-primary)]/10 shadow-md hover:shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                                        <img
                                            src={player.image}
                                            alt={player.name.full}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="w-full py-2 bg-white/10 backdrop-blur-md text-[var(--color-on-primary)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase rounded border border-white/20 pointer-events-none">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)] flex items-center gap-2">
                                            {player.country.image && player.country.image.startsWith('http') ? (
                                                <img src={player.country.image} alt={player.country.name} className="w-5 h-3 object-cover rounded-sm border border-[var(--color-outline-variant)]" />
                                            ) : (
                                                <span>{player.country.image}</span>
                                            )}
                                            {player.country.name} • {player.position}
                                        </span>
                                        <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{player.name.full}</h3>
                                        <p className="text-[12px] text-[var(--color-on-surface-variant)]">ID: {player.playerId} | Bat: {player.battingStyle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && !loading && (
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg font-inter text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors border border-[var(--color-outline-variant)] ${page === 1 ? 'opacity-50 cursor-not-allowed bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]' : 'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] cursor-pointer'}`}
                            >
                                Previous
                            </button>
                            <span className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`px-4 py-2 rounded-lg font-inter text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors border border-[var(--color-outline-variant)] ${page === totalPages ? 'opacity-50 cursor-not-allowed bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]' : 'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] cursor-pointer'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                </section>
            </main>

            <Footer />
        </div>
    );
}
