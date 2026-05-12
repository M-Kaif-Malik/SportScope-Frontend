import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config/api";

import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';

export default function SeriesPage() {
    // page can automatically open/select a specific series based on the URL
    const location = useLocation(); // To read query params for initial series selection
    const queryParams = new URLSearchParams(location.search);
    const initialSeriesId = queryParams.get('seriesId');

    const [seriesList, setSeriesList] = useState([]);
    const [activeSeries, setActiveSeries] = useState(null);
    const [formatFilter, setFormatFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [otherSeriesPage, setOtherSeriesPage] = useState(0);
    const [expandedMatchId, setExpandedMatchId] = useState(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                setLoading(true);
const response = await axios.get(`${API_BASE_URL}/api/series/upcoming?format=${formatFilter}&status=${statusFilter}`);

                const mappedSeries = response.data.series.map(s => {
                    const formats = [];
                    if (s.t20 > 0) formats.push(`${s.t20} T20s`);
                    if (s.odi > 0) formats.push(`${s.odi} ODIs`);
                    if (s.test > 0) formats.push(`${s.test} Tests`);

                    return {
                        id: s.seriesId,
                        title: s.name,
                        startDate: s.startDate,
                        endDate: s.endDate,
                        matchSummary: `${s.matches} Matches (${formats.join(', ')})`,
                        type: 'International',
                        format: formats.length > 1 ? 'Multi-format' : (s.t20 > 0 ? 'T20' : s.odi > 0 ? 'ODI' : s.test > 0 ? 'Test' : 'Unknown'),
                        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000',
                        status: new Date(s.startDate) <= new Date() ? 'Ongoing' : 'Upcoming',
                        matches: [] // To prevent crash until we connect the series details API
                    };
                });

                setSeriesList(mappedSeries);
                if (initialSeriesId) {
                    const found = mappedSeries.find(s => s.id === initialSeriesId);
                    setActiveSeries(found || (mappedSeries.length > 0 ? mappedSeries[0] : null));
                } else if (mappedSeries.length > 0) {
                    setActiveSeries(mappedSeries[0]);
                } else {
                    setActiveSeries(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching series:", error);
                setLoading(false);
            }
        };

        fetchSeries();
    }, [formatFilter, statusFilter, initialSeriesId]);

    useEffect(() => {
        const fetchSeriesInfo = async () => {
            if (!activeSeries || !activeSeries.id) return;
            // If we already have fetched matches (more than 0), skip
            if (activeSeries.matches && activeSeries.matches.length > 0) return;

            try {
const response = await axios.get(`${API_BASE_URL}/api/series/${activeSeries.id}`);
                const seriesData = response.data.series;

                if (seriesData && seriesData.matchList) {
                    const firstMatchWithTeams = seriesData.matchList.find(m => m.teamInfo && m.teamInfo.length >= 2);
                    const teamImages = firstMatchWithTeams ? [firstMatchWithTeams.teamInfo[0].img, firstMatchWithTeams.teamInfo[1].img] : null;

                    const formattedMatches = seriesData.matchList.map(match => {
                        const dateObj = new Date(match.dateTimeGMT);
                        const month = dateObj.toLocaleString('default', { month: 'short' });
                        const day = dateObj.getDate();
                        const time = dateObj.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });

                        return {
                            id: match.id,
                            month: month,
                            day: day,
                            title: match.name.split(',')[1]?.trim() || match.name, // e.g., "3rd Test"
                            venue: match.venue,
                            teams: match.teams.join(' vs '),
                            time: time,
                            status: match.status
                        };
                    });

                    setActiveSeries(prev => prev && prev.id === activeSeries.id ? { ...prev, matches: formattedMatches, teamImages } : prev);
                    setSeriesList(prevList => prevList.map(s => s.id === activeSeries.id ? { ...s, matches: formattedMatches, teamImages } : s));
                }
            } catch (error) {
                console.error("Error fetching series details:", error);
            }
        };

        fetchSeriesInfo();
    }, [activeSeries?.id]);

    // reset page to 0 whenever filters or active series changes
    useEffect(() => {
        setOtherSeriesPage(0);
    }, [formatFilter, statusFilter, activeSeries]);

    const handleSeriesClick = (series) => {
        setActiveSeries(series);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // For pagination of other series (4 per page)
    const otherSeries = activeSeries ? seriesList.filter(s => s.id !== activeSeries.id) : [];
    const paginatedOtherSeries = otherSeries.slice(otherSeriesPage * 4, (otherSeriesPage + 1) * 4);

    const handleNextPage = () => {
        if ((otherSeriesPage + 1) * 4 < otherSeries.length) {
            setOtherSeriesPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (otherSeriesPage > 0) {
            setOtherSeriesPage(prev => prev - 1);
        }
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />

            <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 pt-[112px] pb-12 mt-6">

                {/* Page Title */}
                <div className="mb-8 border-b border-[var(--color-outline-variant)]/20 pb-6">
                    <h1 className="font-manrope text-[48px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-primary)]">International Cricket Series</h1>
                    <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-on-surface-variant)] mt-2">Comprehensive coverage of ongoing and upcoming global tournaments.</p>
                </div>

                <div className="flex flex-col gap-6">

                    {/*Navigation & Filters */}
                    <div className="flex flex-wrap gap-2 items-center justify-center">
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
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] animate-pulse"></span> Ongoing
                            </button>
                            <button
                                onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
                                className={`px-4 py-1.5 rounded-full font-inter text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer border-none ${statusFilter === 'upcoming' ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                            >
                                Upcoming
                            </button>
                        </div>
                    </div>


                    {/* Main Content: Series List / Details View */}
                    <div className="space-y-12">
                        {loading ? (
                            <>
                                {/* Main Active Series Skeleton */}
                                <section className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 rounded-xl overflow-hidden shadow-sm animate-pulse mb-12">
                                    <div className="h-48 md:h-64 bg-[var(--color-surface-variant)] w-full"></div>
                                    <div className="p-6 md:p-12">
                                        <div className="h-8 bg-[var(--color-surface-variant)]/50 w-1/3 mb-6 rounded-md"></div>
                                        <div className="space-y-4">
                                            <div className="h-16 bg-[var(--color-surface-variant)]/30 w-full rounded-md"></div>
                                            <div className="h-16 bg-[var(--color-surface-variant)]/30 w-full rounded-md"></div>
                                            <div className="h-16 bg-[var(--color-surface-variant)]/30 w-full rounded-md"></div>
                                        </div>
                                    </div>
                                </section>
                                {/* Other Series Skeleton */}
                                <section>
                                    <div className="h-8 bg-[var(--color-surface-variant)]/50 w-48 mb-6 rounded-md"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 p-6 rounded-xl animate-pulse">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="h-4 w-16 bg-[var(--color-surface-variant)]/50 rounded"></div>
                                                    <div className="h-4 w-24 bg-[var(--color-surface-variant)]/50 rounded"></div>
                                                </div>
                                                <div className="h-6 w-3/4 bg-[var(--color-surface-variant)]/50 rounded mb-4"></div>
                                                <div className="h-4 w-full bg-[var(--color-surface-variant)]/30 rounded mb-4"></div>
                                                <div className="h-6 w-16 bg-[var(--color-surface-variant)]/50 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : activeSeries ? (
                            <>
                                {/* Current Active Series Highlight */}
                                <section className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 rounded-xl overflow-hidden shadow-sm">
                                    <div className="relative h-48 md:h-64 overflow-hidden">
                                        {activeSeries.teamImages ? (
                                            <div className="absolute inset-0 flex bg-[var(--color-surface)]">
                                                <img src={activeSeries.teamImages[0]} className="w-1/2 h-full object-cover blur-sm opacity-60" alt="Team 1" />
                                                <img src={activeSeries.teamImages[1]} className="w-1/2 h-full object-cover blur-sm opacity-60" alt="Team 2" />
                                            </div>
                                        ) : (
                                            <img
                                                alt="Cricket Stadium"
                                                className="w-full h-full object-cover"
                                                src={activeSeries.image}
                                            />
                                        )}
                                        <div className="absolute inset-0 flex items-end p-6 md:p-12" style={{ background: 'linear-gradient(to top, rgba(33,16,0,0.9) 0%, transparent 100%)' }}>
                                            <div>
                                                <span className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-3 py-1 rounded-full font-inter text-[11px] font-semibold tracking-[0.08em] uppercase mb-2 inline-block">
                                                    {activeSeries.status}
                                                </span>
                                                <h2 className="font-manrope text-[32px] font-bold tracking-[-0.01em] leading-none text-[var(--color-on-primary)] mb-2">
                                                    {activeSeries.title}
                                                </h2>
                                                <p className="text-[var(--color-on-primary)]/80 font-manrope text-[16px] leading-[1.6]">
                                                    {activeSeries.startDate} - {activeSeries.endDate} • {activeSeries.matchSummary}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-12 pt-6 md:pt-6">
                                        <div className="flex items-center justify-between mb-6 border-b border-[var(--color-outline-variant)]/10 pb-2">
                                            <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">Series Schedule</h3>
                                        </div>

                                        <div className="space-y-2">
                                            {activeSeries.matches && activeSeries.matches.map(match => (
                                                <div
                                                    key={match.id}
                                                    onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
                                                    className="flex flex-col p-4 bg-[var(--color-surface)] rounded-lg hover:bg-[var(--color-secondary)]/5 transition-colors group cursor-pointer"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                        <div className="flex items-center gap-6 mb-2 md:mb-0">
                                                            <div className="text-center w-16 border-r border-[var(--color-outline-variant)]/20 pr-6">
                                                                <div className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)]">{match.month}</div>
                                                                <div className="font-manrope text-[20px] font-bold tracking-[-0.01em] leading-none text-[var(--color-primary)]">{match.day}</div>
                                                            </div>
                                                            <div>
                                                                <div className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)]">{match.title} • {match.venue}</div>
                                                                <div className="font-manrope text-[16px] leading-[1.6] font-bold text-[var(--color-on-surface)] mt-1">{match.teams}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between md:justify-end gap-12">
                                                            <span className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">{match.time}</span>
                                                            <MaterialIcon name={expandedMatchId === match.id ? 'expand_less' : 'expand_more'} className="text-[var(--color-on-surface-variant)]" />
                                                        </div>
                                                    </div>
                                                    {expandedMatchId === match.id && (
                                                        <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/10">
                                                            <span className="font-inter text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-1">Status</span>
                                                            <span className="font-manrope text-[14px] font-medium text-[var(--color-primary)]">{match.status || 'Match info unavailable'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {(!activeSeries.matches || activeSeries.matches.length === 0) && (
                                                <p className="text-[var(--color-on-surface-variant)] text-sm py-4">Matches will be loaded here when series info is connected.</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Other Series List */}
                                {otherSeries.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-manrope text-[24px] font-semibold text-[var(--color-primary)]">Other Series</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handlePrevPage}
                                                    disabled={otherSeriesPage === 0}
                                                    className={`p-2 rounded-full border border-[var(--color-outline-variant)]/30 ${otherSeriesPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-surface-variant)] transition-colors'}`}
                                                >
                                                    <MaterialIcon name="chevron_left" className="text-[var(--color-on-surface)] text-sm" />
                                                </button>
                                                <button
                                                    onClick={handleNextPage}
                                                    disabled={(otherSeriesPage + 1) * 4 >= otherSeries.length}
                                                    className={`p-2 rounded-full border border-[var(--color-outline-variant)]/30 ${(otherSeriesPage + 1) * 4 >= otherSeries.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-surface-variant)] transition-colors'}`}
                                                >
                                                    <MaterialIcon name="chevron_right" className="text-[var(--color-on-surface)] text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {paginatedOtherSeries.map((series) => (
                                                <div
                                                    key={series.id}
                                                    onClick={() => handleSeriesClick(series)}
                                                    className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/10 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)] px-2 py-0.5 rounded font-inter text-[9px] font-semibold tracking-[0.08em] uppercase">{series.type}</span>
                                                        <span className="font-inter text-[12px] font-medium text-[var(--color-on-surface-variant)]">Starts {series.startDate}</span>
                                                    </div>
                                                    <h4 className="font-manrope text-[20px] font-semibold text-[var(--color-primary)] mb-1">{series.title}</h4>
                                                    <p className="text-[var(--color-on-surface-variant)] font-manrope text-[14px] leading-[1.6] mb-4">{series.matchSummary}</p>
                                                    <div className="flex gap-2">
                                                        <span className="bg-[var(--color-surface-variant)] text-black px-2 py-1 rounded text-[10px] font-inter font-semibold tracking-[0.08em] uppercase">{series.format}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 text-[var(--color-on-surface-variant)]">
                                No series found for the selected filters.
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
