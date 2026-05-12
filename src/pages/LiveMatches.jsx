import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import API_BASE_URL from "../config/api";

export default function LiveMatches() {
    const [liveMatches, setLiveMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [formatFilter, setFormatFilter] = useState('all'); // all, t20, odi, test
    const [statusFilter, setStatusFilter] = useState('all'); // all, live, upcoming
    const [expandedMatchId, setExpandedMatchId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    
    const location = useLocation();

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, formatFilter, statusFilter]);

    // Handle deep linking to specific match
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const matchId = queryParams.get('matchId');
        if (matchId && !loading) {
            setExpandedMatchId(matchId);
            // Delay slightly to ensure DOM has rendered the expanded state
            setTimeout(() => {
                const element = document.getElementById(`match-${matchId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [location.search, loading]);

    // Fetch live and upcoming matches
    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            try {
                const [liveRes, upcomingRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/matches/live`),
                    fetch(`${API_BASE_URL}/api/matches/upcoming`)
                ]);

                if (!liveRes.ok || !upcomingRes.ok) {
                    throw new Error('Failed to fetch match data');
                }

                const liveData = await liveRes.json();
                const upcomingData = await upcomingRes.json();

                // Ensure matches arrays are defined, default to empty
                const liveDataMatches = Array.isArray(liveData.matches) ? liveData.matches : [];
                const upcomingDataMatches = Array.isArray(upcomingData.matches) ? upcomingData.matches : [];

                setLiveMatches(liveDataMatches);
                setUpcomingMatches(upcomingDataMatches);
            } catch (err) {
                console.error("Error fetching matches:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
        // Set up polling for live matches every 30 seconds
        const interval = setInterval(fetchMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    // Combine and process matches
    let combinedMatches = [];
    if (statusFilter === 'all' || statusFilter === 'live') {
        combinedMatches = [...combinedMatches, ...liveMatches.map(m => ({ ...m, _type: 'live' }))];
    }
    if (statusFilter === 'all' || statusFilter === 'upcoming') {
        combinedMatches = [...combinedMatches, ...upcomingMatches.map(m => ({ ...m, _type: 'upcoming' }))];
    }

    const filteredMatches = combinedMatches.filter(match => {
        // Search Filter
        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            matchesSearch =
                (match.name && match.name.toLowerCase().includes(term)) ||
                (match.venue && match.venue.toLowerCase().includes(term)) ||
                (match.series && match.series.toLowerCase().includes(term)) ||
                (match.teamA?.name && match.teamA.name.toLowerCase().includes(term)) ||
                (match.teamB?.name && match.teamB.name.toLowerCase().includes(term));
        }

        // Format Filter
        let matchesFormat = true;
        if (formatFilter !== 'all') {
            matchesFormat = match.format?.toLowerCase() === formatFilter;
        }

        return matchesSearch && matchesFormat;
    });

    // Format date string
    const formatUpcomingDate = (dateString, rawStatus) => {
        if (rawStatus && rawStatus.includes('Match starts at')) {
            return rawStatus.replace('Match starts at', '').trim();
        }
        if (!dateString) return 'Upcoming';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />

            <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[140px]">
                {/* Archive Header & Filters */}
                <section className="mb-12 border-b border-[var(--color-outline-variant)]/20 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-3 h-3 rounded-full bg-[var(--color-error)] animate-pulse inline-block"></span>
                                <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-error)] block">Live Matches</span>
                            </div>
                            <h2 className="font-manrope text-[48px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-primary)]">Match Center</h2>
                            <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-on-surface-variant)] max-w-2xl mt-2">
                                Real-time match records and scores from across the cricket world.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <input
                                className="w-full bg-[var(--color-surface-container-low)] border-b-2 border-[var(--color-outline)]/20 focus:border-[var(--color-secondary)] outline-none py-2 pl-4 pr-10 font-manrope text-[16px] transition-all duration-300"
                                placeholder="Search team or venue..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MaterialIcon name="search" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="mt-6 flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2 pr-4 mr-4 border-r border-[var(--color-outline-variant)]/30">
                            <MaterialIcon name="filter_list" className="text-[var(--color-on-surface-variant)] text-sm" />
                            <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface)]">Filters:</span>
                        </div>

                        {/* Match Type */}
                        <div className="flex flex-wrap gap-2">
                            {['all', 't20', 'odi', 'test'].map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormatFilter(fmt)}
                                    className={`px-4 py-1.5 rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer border-none ${formatFilter === fmt ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                                >
                                    {fmt === 'all' ? 'All Formats' : fmt}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-px bg-[var(--color-outline-variant)]/30 mx-2 hidden md:block"></div>

                        {/* Status */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setStatusFilter(statusFilter === 'live' ? 'all' : 'live')}
                                className={`px-4 py-1.5 rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors flex items-center gap-2 cursor-pointer border-none ${statusFilter === 'live' ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] animate-pulse"></span> Live
                            </button>
                            <button
                                onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
                                className={`px-4 py-1.5 rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer border-none ${statusFilter === 'upcoming' ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                            >
                                Upcoming
                            </button>
                        </div>
                    </div>
                </section>

                {/* Match Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading && filteredMatches.length === 0 ? (
                        /* Loading Skeleton State */
                        [1, 2, 3].map(i => (
                            <div key={`skel-${i}`} className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/10 p-6 rounded-lg animate-pulse min-h-[300px]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-24 h-3 bg-[var(--color-surface-variant)] rounded"></div>
                                    <div className="w-12 h-3 bg-[var(--color-surface-variant)] rounded"></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/2 h-8 bg-[var(--color-surface-variant)] rounded"></div>
                                        <div className="w-1/4 h-8 bg-[var(--color-surface-variant)] rounded"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="w-1/2 h-8 bg-[var(--color-surface-variant)] rounded"></div>
                                        <div className="w-1/4 h-8 bg-[var(--color-surface-variant)] rounded"></div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-[var(--color-outline-variant)]/10 flex gap-4">
                                    <div className="flex-1 h-10 bg-[var(--color-surface-variant)] rounded"></div>
                                    <div className="flex-1 h-10 bg-[var(--color-surface-variant)] rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        /* Error State */
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-[var(--color-surface-container)]/30 border-2 border-dashed border-[var(--color-outline-variant)] p-6 rounded-lg text-center min-h-[300px]">
                            <MaterialIcon name="cloud_off" className="text-4xl text-[var(--color-outline)] mb-4" />
                            <h4 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">Unable to fetch matches</h4>
                            <p className="font-manrope text-[16px] text-[var(--color-on-surface-variant)] mt-2 max-w-[300px]">We encountered an error connecting to the live match server.</p>
                            <button onClick={() => window.location.reload()} className="mt-6 font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)] underline bg-transparent border-none cursor-pointer">REFRESH FEED</button>
                        </div>
                    ) : filteredMatches.length === 0 ? (
                        /* Empty State */
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-[var(--color-surface-container)]/30 border-2 border-dashed border-[var(--color-outline-variant)] p-6 rounded-lg text-center min-h-[300px]">
                            <MaterialIcon name="event_busy" className="text-4xl text-[var(--color-outline)] mb-4" />
                            <h4 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">No Matches Found</h4>
                            <p className="font-manrope text-[16px] text-[var(--color-on-surface-variant)] mt-2 max-w-[300px]">Try adjusting your search terms or filters.</p>
                        </div>
                    ) : (
                        <>
                            {filteredMatches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(match => {
                            const displayFormat = match.format && match.format.toLowerCase() !== 'unknown' ? match.format : '';
                            const formatText = [displayFormat, match.series].filter(Boolean).join(' • ');

                            if (match._type === 'live') {
                                /* LIVE MATCH CARD */
                                const t1Score = match.score && match.score[0] ? `${match.score[0].runs}/${match.score[0].wickets}` : '---';
                                const t1Overs = match.score && match.score[0] && match.score[0].overs ? `(${match.score[0].overs})` : '';
                                const t2Score = match.score && match.score[1] ? `${match.score[1].runs}/${match.score[1].wickets}` : '---';
                                const t2Overs = match.score && match.score[1] && match.score[1].overs ? `(${match.score[1].overs})` : '';

                                return (
                                    <div key={match.id} 
                                         id={`match-${match.id}`}
                                         onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
                                         className="group bg-[var(--color-surface-container-lowest)] border border-[var(--color-primary)]/10 p-6 rounded-lg shadow-[rgba(56,36,13,0.04)_0px_8px_24px] hover:shadow-[rgba(56,36,13,0.08)_0px_12px_32px] transition-all duration-300 flex flex-col justify-between cursor-pointer">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                {formatText && (
                                                    <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary-container)] bg-[var(--color-primary-container)] px-2 py-0.5 rounded truncate max-w-[200px]">
                                                        {formatText}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                    <span className="w-2 h-2 rounded-full bg-[var(--color-error)] animate-pulse"></span>
                                                    <span className="font-inter text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-error)]">Live</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {match.teamA?.logo ? (
                                                            <img src={match.teamA.logo} alt={match.teamA.name} className="w-8 h-8 object-contain rounded-sm" />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-sm"></div>
                                                        )}
                                                        <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamA?.short || match.teamA?.name || 'T1'}</span>
                                                    </div>
                                                    <span className="font-manrope text-[32px] font-extrabold text-[var(--color-primary)]">
                                                        {t1Score} <span className="text-[var(--color-on-surface-variant)] text-[16px] font-normal">{t1Overs}</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between opacity-80">
                                                    <div className="flex items-center gap-3">
                                                        {match.teamB?.logo ? (
                                                            <img src={match.teamB.logo} alt={match.teamB.name} className="w-8 h-8 object-contain rounded-sm" />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-[var(--color-surface-variant)] rounded-sm"></div>
                                                        )}
                                                        <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamB?.short || match.teamB?.name || 'T2'}</span>
                                                    </div>
                                                    <span className="font-manrope text-[32px] font-extrabold text-[var(--color-secondary)]">
                                                        {t2Score} <span className="text-[var(--color-on-surface-variant)] text-[16px] font-normal">{t2Overs}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-[var(--color-outline-variant)]/10">
                                            <p className="font-manrope text-[16px] text-[var(--color-secondary)] font-medium italic">{match.status || 'Match in progress'}</p>
                                        </div>

                                        {expandedMatchId === match.id && (
                                            <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/10 transition-all duration-300">
                                                <h5 className="font-manrope text-[16px] font-bold text-[var(--color-primary)] mb-3">Match Details</h5>
                                                <div className="space-y-2 font-inter text-[12px] text-[var(--color-on-surface-variant)] leading-relaxed">
                                                    <p><strong className="text-[var(--color-primary)] font-semibold uppercase tracking-wider">Series:</strong> {match.name || 'Unknown'}</p>
                                                    <p><strong className="text-[var(--color-primary)] font-semibold uppercase tracking-wider">Venue:</strong> {match.venue || 'Unknown'}</p>
                                                    <p><strong className="text-[var(--color-primary)] font-semibold uppercase tracking-wider">Format:</strong> {match.format || 'Unknown'}</p>
                                                    <p><strong className="text-[var(--color-primary)] font-semibold uppercase tracking-wider">Date:</strong> {match.date ? new Date(match.date).toLocaleDateString() : 'Unknown'}</p>
                                                    
                                                    {match.score && match.score.length > 0 && (
                                                        <div className="mt-4 bg-[var(--color-surface-container-low)] p-3 rounded">
                                                            <strong className="text-[var(--color-primary)] font-semibold uppercase tracking-wider block mb-2">Innings Breakdown:</strong>
                                                            <ul className="list-none p-0 space-y-2">
                                                                {match.score.map((inning, idx) => (
                                                                    <li key={idx} className="flex justify-between items-center border-b border-[var(--color-outline-variant)]/10 pb-1 last:border-0 last:pb-0">
                                                                        <span className="capitalize">{inning.inning}</span>
                                                                        <span>
                                                                            <span className="font-bold text-[var(--color-primary)] text-[14px]">{inning.runs}/{inning.wickets}</span> 
                                                                            <span className="text-[10px] ml-1">({inning.overs} ov)</span>
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            } else {
                                /* UPCOMING MATCH CARD */
                                return (
                                    <div key={match.id} className="group bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 p-6 rounded-lg hover:border-[var(--color-secondary)]/20 transition-all duration-300 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                {formatText && (
                                                    <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] truncate max-w-[200px]">
                                                        {formatText}
                                                    </span>
                                                )}
                                                <span className={`font-inter text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-on-tertiary-container)] shrink-0 ml-2 ${!formatText ? 'ml-auto' : ''}`}>Upcoming</span>
                                            </div>
                                            <div className="flex flex-col items-center py-4 space-y-4">
                                                <div className="flex items-center gap-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        {match.teamA?.logo ? (
                                                            <img src={match.teamA.logo} alt={match.teamA.name} className="w-12 h-12 object-contain rounded shadow-sm bg-[var(--color-surface-container-lowest)] p-1" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-[var(--color-surface-variant)] rounded shadow-sm"></div>
                                                        )}
                                                        <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamA?.short || 'T1'}</span>
                                                    </div>
                                                    <span className="font-manrope text-[32px] font-extrabold text-[var(--color-outline-variant)] italic">VS</span>
                                                    <div className="flex flex-col items-center gap-2">
                                                        {match.teamB?.logo ? (
                                                            <img src={match.teamB.logo} alt={match.teamB.name} className="w-12 h-12 object-contain rounded shadow-sm bg-[var(--color-surface-container-lowest)] p-1" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-[var(--color-surface-variant)] rounded shadow-sm"></div>
                                                        )}
                                                        <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamB?.short || 'T2'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-center space-y-1 pt-4 w-full px-2">
                                                    <p className="font-manrope text-[20px] font-semibold text-[var(--color-secondary)] truncate">
                                                        {formatUpcomingDate(match.date, match.rawStatus)}
                                                    </p>
                                                    <p className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] truncate">
                                                        {match.venue || 'Venue TBD'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        </>
                    )}
                </section>

                // Page Change Controls
                {Math.ceil(filteredMatches.length / ITEMS_PER_PAGE) > 1 && (
                    <nav className="mt-12 flex justify-center items-center gap-2">
                        <button 
                            onClick={() => {
                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <MaterialIcon name="arrow_back" />
                        </button>
                        
                        {Array.from({ length: Math.ceil(filteredMatches.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                            <button 
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-10 h-10 rounded-full font-inter text-[12px] font-semibold tracking-[0.08em] border-none cursor-pointer transition-colors ${
                                    currentPage === page 
                                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' 
                                        : 'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => {
                                setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredMatches.length / ITEMS_PER_PAGE)));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === Math.ceil(filteredMatches.length / ITEMS_PER_PAGE)}
                            className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <MaterialIcon name="arrow_forward" />
                        </button>
                    </nav>
                )}
            </main>

            <Footer />
        </div>
    );
}
