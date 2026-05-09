import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchCard } from './MatchCard';
import { IconButton } from '../ui/IconButton';

const MatchCarousel = ({ title, matches, icon, color, onCardClick }) => {
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

    if (!matches || matches.length === 0) return null;

    return (
        <div className="w-full mt-10">
            <div className="px-4 md:px-12 max-w-[1280px] mx-auto flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <h3 className={`font-manrope text-[24px] font-bold tracking-[-0.01em] ${color}`}>
                        {title}
                    </h3>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <IconButton
                        icon="chevron_left"
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full bg-[var(--color-surface)] hover:bg-gray-100 border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)]"
                    />
                    <IconButton
                        icon="chevron_right"
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full bg-[var(--color-surface)] hover:bg-gray-100 border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)]"
                    />
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-4 md:px-12 max-w-[1280px] mx-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
            >
                {matches.map((match) => (
                    <div 
                        key={match.id} 
                        className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => onCardClick && onCardClick(match)}
                    >
                        <div className="pointer-events-none h-full">
                            <MatchCard {...match} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MatchSection = () => {
    const navigate = useNavigate();
    const [liveMatches, setLiveMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const [liveRes, upcomingRes, savedRes] = await Promise.all([
                    fetch('http://localhost:5000/api/matches/live').then(r => r.ok ? r.json() : { matches: [] }),
                    fetch('http://localhost:5000/api/matches/upcoming').then(r => r.ok ? r.json() : { matches: [] }),
                    fetch('http://localhost:5000/api/matches/saved').then(r => r.ok ? r.json() : { matches: [] })
                ]);

                // Live matches: max 3
                setLiveMatches((liveRes.matches || []).slice(0, 3));
                
                // Upcoming: nearest start time
                const upcoming = upcomingRes.matches || [];
                upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
                setUpcomingMatches(upcoming.slice(0, 4));

                // Completed: most recent finish time (sort descending by date)
                const completed = savedRes.matches || [];
                completed.sort((a, b) => new Date(b.date) - new Date(a.date));
                setCompletedMatches(completed.slice(0, 3));
                
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const handleLiveClick = (match) => {
        navigate(`/live?matchId=${match.id}`);
    };

    return (
        <section className="w-full mt-4">
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="animate-pulse text-[var(--color-on-surface-variant)] font-inter">Loading Matches...</span>
                </div>
            ) : (
                <>
                    <MatchCarousel 
                        title="Live Matches" 
                        icon="🟢" 
                        color="text-red-500" 
                        matches={liveMatches} 
                        onCardClick={handleLiveClick} 
                    />
                    <MatchCarousel 
                        title="Upcoming Matches" 
                        icon="🟡" 
                        color="text-[var(--color-primary)]" 
                        matches={upcomingMatches} 
                    />
                    <MatchCarousel 
                        title="Completed Matches" 
                        icon="🔵" 
                        color="text-blue-500" 
                        matches={completedMatches} 
                    />
                </>
            )}
        </section>
    );
};
