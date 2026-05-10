import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { TennisMatchCard } from '../../components/tennis/TennisMatchCard';
import { getTodayFixtures, getCompletedFixtures } from '../../services/tennisApi';
import { MaterialIcon } from '../../components/ui/MaterialIcon';

export default function TennisMatches() {
    const [tourType, setTourType] = useState('atp'); // 'atp' or 'wta'
    
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const res = await getTodayFixtures(tourType);
                const allToday = res?.fixtures || [];
                
                // Only upcoming matches
                setMatches(allToday.filter(m => m.live !== 1 && m.complete !== 1));
            } catch (err) {
                console.error("Failed to load matches", err);
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [tourType]);

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <TennisSecondaryNavbar />
            <main className="pt-[144px] pb-24 px-4 md:px-12 max-w-[1280px] mx-auto min-h-screen">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight leading-[1.1] mb-2 text-[var(--color-on-surface)]">
                            Upcoming Matches
                        </h1>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)]">
                            Explore upcoming fixtures for the current tennis season.
                        </p>
                    </div>

                    {/* ATP / WTA Toggle */}
                    <div className="flex bg-[var(--color-surface-container-high)] rounded-lg p-1 w-max">
                        <button 
                            onClick={() => setTourType('atp')}
                            className={`px-6 py-2 rounded-md font-inter text-[12px] font-bold tracking-wider uppercase transition-colors border-none cursor-pointer ${tourType === 'atp' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                        >
                            ATP
                        </button>
                        <button 
                            onClick={() => setTourType('wta')}
                            className={`px-6 py-2 rounded-md font-inter text-[12px] font-bold tracking-wider uppercase transition-colors border-none cursor-pointer ${tourType === 'wta' ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' : 'bg-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                        >
                            WTA
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                        ))}
                    </div>
                ) : matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map(match => (
                            <TennisMatchCard key={match.id || match.fixtureId} match={match} onClick={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-24 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                        <MaterialIcon name="sports_tennis" className="text-[64px] text-[var(--color-outline-variant)] mb-4 opacity-50" />
                        <h3 className="font-manrope text-[20px] font-bold text-[var(--color-on-surface)] mb-2">No Matches Found</h3>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center max-w-md">
                            There are no upcoming matches for the {tourType.toUpperCase()} tour right now. Check back later.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
