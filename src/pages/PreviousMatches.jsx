import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export default function PreviousMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTeam, setSearchTeam] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [formatFilter, setFormatFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTeam, dateRange, formatFilter]);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/matches/saved')
            .then(res => res.json())
            .then(data => {
                setMatches(data.matches || []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Filter matches
    const filteredMatches = matches.filter(match => {
        let matchesSearch = true;
        if (searchTeam) {
            const term = searchTeam.toLowerCase();
            matchesSearch =
                (match.teamA?.name && match.teamA.name.toLowerCase().includes(term)) ||
                (match.teamB?.name && match.teamB.name.toLowerCase().includes(term));
        }

        let matchesDate = true;
        if (dateRange) {
            const matchDate = new Date(match.date).toISOString().split('T')[0];
            matchesDate = matchDate === dateRange;
        }

        let matchesFormat = true;
        if (formatFilter) {
            matchesFormat = match.format?.toLowerCase() === formatFilter.toLowerCase();
        }

        return matchesSearch && matchesDate && matchesFormat;
    });

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />

            <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[112px]">
                {/* Header & Breadcrumbs */}
                <section className="mb-12 mt-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-manrope text-[48px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-primary)]">Previous Matches</h1>
                            <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-on-surface-variant)] mt-2 max-w-2xl">
                                Match history with full score details.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Advanced Search & Filter Bar */}
                <section className="mb-12 bg-[var(--color-surface-container-low)] p-6 rounded-xl border border-[var(--color-primary)]/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-2">SEARCH TEAM</label>
                            <div className="relative">
                                <input
                                    className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] px-3 py-2 outline-none font-manrope text-[16px] transition-colors"
                                    placeholder="e.g. Manchester United"
                                    type="text"
                                    value={searchTeam}
                                    onChange={(e) => setSearchTeam(e.target.value)}
                                />
                                <MaterialIcon name="search" className="absolute right-2 top-2 text-[var(--color-on-surface-variant)]" />
                            </div>
                        </div>
                        <div>
                            <label className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-2">FORMAT</label>
                            <select
                                className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] px-2 py-2 outline-none font-inter text-[14px] transition-colors cursor-pointer"
                                value={formatFilter}
                                onChange={(e) => setFormatFilter(e.target.value)}
                            >
                                <option value="">All Formats</option>
                                <option value="t20">T20</option>
                                <option value="odi">ODI</option>
                                <option value="test">Test</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-2">DATE</label>
                            <div className="flex items-center gap-2">
                                <input
                                    className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] px-2 py-2 outline-none font-inter text-[14px] text-[var(--color-on-surface)] transition-colors [color-scheme:--color-on-surface] "
                                    type="date"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Archive Content: Asymmetric Grid Layout */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Main Archive List */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="space-y-6 w-full">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)]/10 flex flex-col md:flex-row animate-pulse overflow-hidden min-h-[128px]">
                                        <div className="md:w-48 h-32 md:h-auto bg-[var(--color-surface-container)]"></div>
                                        <div className="flex-1 p-4 md:p-6 flex flex-col justify-center space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="h-3 w-32 bg-[var(--color-surface-variant)] rounded"></div>
                                                <div className="h-3 w-16 bg-[var(--color-surface-variant)] rounded"></div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-10 h-6 bg-[var(--color-surface-variant)] rounded"></div>
                                                    <div className="w-8 h-6 bg-[var(--color-surface-variant)] rounded"></div>
                                                </div>
                                                <div className="h-6 w-16 bg-[var(--color-surface-variant)] rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredMatches.length === 0 ? (
                            <div className="text-center py-20 text-[var(--color-on-surface-variant)]">
                                No previous matches found.
                            </div>
                        ) : (
                            <>
                                {filteredMatches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(match => {
                                    const t1Score = match.score && match.score[0] ? `${match.score[0].runs}/${match.score[0].wickets}` : '---';
                                    const t2Score = match.score && match.score[1] ? `${match.score[1].runs}/${match.score[1].wickets}` : '---';

                                    return (
                                        <div key={match._id} className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-primary)]/10 overflow-hidden shadow-[0_4px_20px_-2px_rgba(56,36,13,0.08)] group hover:border-[var(--color-secondary)]/30 transition-all cursor-pointer">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-48 h-32 md:h-auto relative overflow-hidden bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-high)] flex items-center justify-center min-h-[128px]">
                                                    {/* Team A Logo - Top Left Blurred */}
                                                    {match.teamA?.logo ? (
                                                        <img src={match.teamA.logo} alt={match.teamA.name} className="absolute -top-4 -left-4 w-24 h-24 object-contain opacity-40 blur-md mix-blend-multiply scale-110" />
                                                    ) : null}

                                                    {/* Team B Logo - Bottom Right Blurred */}
                                                    {match.teamB?.logo ? (
                                                        <img src={match.teamB.logo} alt={match.teamB.name} className="absolute -bottom-4 -right-4 w-24 h-24 object-contain opacity-40 blur-md mix-blend-multiply scale-110" />
                                                    ) : null}

                                                    {/* Inner Shadow / Vignette for better merging */}
                                                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(33,16,0,0.05)] pointer-events-none"></div>

                                                    <div className="absolute top-2 left-2 z-20">
                                                        <span className="bg-[var(--color-primary)] text-white text-[10px] font-inter font-semibold tracking-[0.08em] uppercase px-2 py-1 rounded shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                                            {match.format || 'CRICKET'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">
                                                            {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {match.venue || 'Unknown Venue'}
                                                        </span>
                                                        <MaterialIcon name="history" className="text-[var(--color-secondary)]" />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                {match.teamA?.logo && <img src={match.teamA.logo} alt={match.teamA.name} className="w-6 h-6 rounded-full object-cover" />}
                                                                <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamA?.name || 'Team 1'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {match.teamB?.logo && <img src={match.teamB.logo} alt={match.teamB.name} className="w-6 h-6 rounded-full object-cover" />}
                                                                <span className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">{match.teamB?.name || 'Team 2'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="font-manrope text-[32px] font-bold tracking-[-0.01em] text-[var(--color-secondary)]">{t1Score}</span>
                                                            <span className="font-manrope text-[32px] font-bold tracking-[-0.01em] text-[var(--color-on-surface-variant)]/60">{t2Score}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/20">
                                                        <span className="font-inter text-[12px] font-medium text-[var(--color-on-surface)]">{match.status || 'Match Completed'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                                className={`w-10 h-10 rounded-full font-inter text-[12px] font-semibold tracking-[0.08em] border-none cursor-pointer transition-colors ${currentPage === page
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
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
