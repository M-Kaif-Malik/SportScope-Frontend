import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchCard } from './MatchCard';
import { IconButton } from '../ui/IconButton';
import API_BASE_URL from "../../config/api";


const MatchCarousel = forwardRef(({ matches, onCardClick }, ref) => {
    if (!matches || matches.length === 0) return (
        <div className="flex justify-center py-10">
            <span className="text-[var(--color-on-surface-variant)] font-inter italic">No matches found for this filter.</span>
        </div>
    );

    return (
        <div className="w-full mt-4">
            <div
                ref={ref}
                className="flex gap-6 overflow-x-auto px-4 md:px-12 max-w-[1280px] mx-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
            >
                {matches.map((match) => (
                    <div 
                        key={match.id} 
                        className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] h-[300px] flex"
                    >
                        <MatchCard match={match} onClick={() => onCardClick && onCardClick(match)} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export const MatchSection = () => {
    const navigate = useNavigate();
    const [allMatches, setAllMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formatFilter, setFormatFilter] = useState('All');

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 3 || 400; 
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const filters = [
        { id: 'All', label: 'All Matches' },
        { id: 't20', label: 'T20 International' },
        { id: 'odi', label: 'ODI Series' },
        { id: 'test', label: 'Test Championship' }
    ];

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const [liveRes, upcomingRes, savedRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/matches/live`).then(r => r.ok ? r.json() : { matches: [] }),
                    fetch(`${API_BASE_URL}/api/matches/upcoming`).then(r => r.ok ? r.json() : { matches: [] }),
                    fetch(`${API_BASE_URL}/api/matches/saved`).then(r => r.ok ? r.json() : { matches: [] })
                ]);

                let combined = [];

                if (liveRes.matches) {
                    // All live matches
                    combined = combined.concat(liveRes.matches.map(m => ({ ...m, _type: 'live' })));
                }

                if (upcomingRes.matches) {
                    // 5 upcoming matches
                    const upcoming = upcomingRes.matches.map(m => ({ ...m, _type: 'upcoming' }));
                    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
                    combined = combined.concat(upcoming.slice(0, 5));
                }

                if (savedRes.matches) {
                    // 5 previous matches
                    const completed = savedRes.matches.map(m => ({ ...m, _type: 'finished' }));
                    completed.sort((a, b) => new Date(b.date) - new Date(a.date));
                    combined = combined.concat(completed.slice(0, 5));
                }

                setAllMatches(combined);
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    useEffect(() => {
        if (formatFilter === 'All') {
            setFilteredMatches(allMatches);
        } else {
            setFilteredMatches(allMatches.filter(match => 
                match.format && match.format.toLowerCase() === formatFilter.toLowerCase()
            ));
        }
    }, [formatFilter, allMatches]);

    const handleLiveClick = (match) => {
        if (match._type === 'live') {
            navigate(`/live?matchId=${match.id}`);
        }
    };

    return (
        <section className="w-full mt-10">
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            
            {/* Match Filter Tabs */}
            <div className="w-full px-4 md:px-12 max-w-[1280px] mx-auto">
                <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)]/30 pb-2">
                    
                    {/* Filters */}
                    <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setFormatFilter(filter.id)}
                                className={`font-inter text-[12px] font-semibold tracking-[0.08em] uppercase pb-2 whitespace-nowrap bg-transparent border-none cursor-pointer transition-colors ${
                                    formatFilter === filter.id 
                                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
                                }`}
                                style={{ marginBottom: '-2px' }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Scroll Controls */}
                    <div className="hidden md:flex items-center gap-2 ml-4 shrink-0">
                        <IconButton
                            icon="chevron_left"
                            onClick={() => scroll('left')}
                            className="w-8 h-8 rounded-full bg-[var(--color-surface)] hover:bg-gray-100 border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] flex items-center justify-center"
                        />
                        <IconButton
                            icon="chevron_right"
                            onClick={() => scroll('right')}
                            className="w-8 h-8 rounded-full bg-[var(--color-surface)] hover:bg-gray-100 border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] flex items-center justify-center"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="animate-pulse text-[var(--color-on-surface-variant)] font-inter">Loading Matches...</span>
                </div>
            ) : (
                <MatchCarousel ref={scrollRef} matches={filteredMatches} onCardClick={handleLiveClick} />
            )}
        </section>
    );
};
