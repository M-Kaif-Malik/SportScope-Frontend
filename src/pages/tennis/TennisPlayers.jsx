import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { TennisPlayerCard } from '../../components/tennis/TennisPlayerCard';
import { searchPlayers } from '../../services/tennisApi';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useNavigate } from 'react-router-dom';

export default function TennisPlayers() {
    const [tourType, setTourType] = useState('atp'); // 'atp' or 'wta'
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    // Debounce search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!debouncedQuery.trim()) {
                setPlayers([]);
                setHasSearched(false);
                return;
            }

            setLoading(true);
            setHasSearched(true);
            try {
                const res = await searchPlayers(debouncedQuery, tourType);
                // Assume results are returned in res.results
                setPlayers(res?.results || []);
            } catch (err) {
                console.error("Failed to search players", err);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [debouncedQuery, tourType]);

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <TennisSecondaryNavbar />
            <main className="pt-[144px] pb-24 px-4 md:px-12 max-w-[1280px] mx-auto min-h-screen">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight leading-[1.1] mb-2 text-[var(--color-on-surface)]">
                            Player Directory
                        </h1>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)]">
                            Search for tennis players across ATP and WTA tours.
                        </p>
                    </div>

                    {/* ATP / WTA Toggle */}
                    <div className="flex bg-[var(--color-surface-container-high)] rounded-lg p-1 w-max">
                        <button 
                            onClick={() => {
                                setTourType('atp');
                                setPlayers([]);
                                setHasSearched(false);
                                setSearchQuery('');
                            }}
                            className={`px-6 py-2 rounded-md font-inter text-[12px] font-bold tracking-wider uppercase transition-colors border-none cursor-pointer ${tourType === 'atp' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                        >
                            ATP
                        </button>
                        <button 
                            onClick={() => {
                                setTourType('wta');
                                setPlayers([]);
                                setHasSearched(false);
                                setSearchQuery('');
                            }}
                            className={`px-6 py-2 rounded-md font-inter text-[12px] font-bold tracking-wider uppercase transition-colors border-none cursor-pointer ${tourType === 'wta' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                        >
                            WTA
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-12 relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MaterialIcon name="search" className="text-[var(--color-on-surface-variant)]" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${tourType.toUpperCase()} players (e.g. "Djokovic")`}
                        className="w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/30 rounded-full py-4 pl-12 pr-4 font-inter text-[16px] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-sm"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-24 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                        ))}
                    </div>
                ) : hasSearched ? (
                    players.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {players.map((player) => (
                                <TennisPlayerCard 
                                    key={player.id || player._id} 
                                    player={player} 
                                    onClick={() => navigate(`/tennis/player/${player.id || player._id}?type=${tourType}`)} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-24 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                            <MaterialIcon name="person_search" className="text-[64px] text-[var(--color-outline-variant)] mb-4 opacity-50" />
                            <h3 className="font-manrope text-[20px] font-bold text-[var(--color-on-surface)] mb-2">No Players Found</h3>
                            <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center max-w-md">
                                We couldn't find any {tourType.toUpperCase()} players matching "{debouncedQuery}". Try another name.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="w-full py-24 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                        <MaterialIcon name="search" className="text-[64px] text-[var(--color-outline-variant)] mb-4 opacity-50" />
                        <h3 className="font-manrope text-[20px] font-bold text-[var(--color-on-surface)] mb-2">Search Players</h3>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center max-w-md">
                            Type a player's name above to search the database.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
