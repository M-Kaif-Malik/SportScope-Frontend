import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { getTodayFixtures, getTournamentCalendar } from '../../services/tennisApi';
import { TennisMatchCard } from '../../components/tennis/TennisMatchCard';
import { TournamentCard } from '../../components/tennis/TournamentCard';
import { Link } from 'react-router-dom';

import img1 from '../../assets/images/t1.webp';
import img2 from '../../assets/images/t2.jpeg';
import img3 from '../../assets/images/t3.jfif';
import img4 from '../../assets/images/t4.jpg';

const images = [img1, img2, img3, img4];

export default function TennisHome() {
    const [matches, setMatches] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [index, setIndex] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch today's ATP fixtures
                const fixturesRes = await getTodayFixtures('atp');
                setMatches(fixturesRes?.fixtures || []);
            } catch (err) {
                console.error("Failed to load today's matches", err);
            } finally {
                setLoadingMatches(false);
            }

            try {
                // Fetch current year tournaments
                const currentYear = new Date().getFullYear();
                const tourneysRes = await getTournamentCalendar(currentYear, 'atp');
                setTournaments(tourneysRes?.tournaments?.slice(0, 4) || []);
            } catch (err) {
                console.error("Failed to load tournaments", err);
            } finally {
                setLoadingTournaments(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <TennisSecondaryNavbar />
            <main className="pt-[144px] pb-12 px-4 md:px-12 max-w-[1280px] mx-auto">
                {/* Hero Section */}
                <div
                    className="relative rounded-xl overflow-hidden flex items-end p-6 md:p-12 min-h-[500px] mb-12"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div className="absolute inset-0 z-0">
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`tennis-hero-${i}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                                    ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
                                    ${hover ? 'scale-110' : ''}
                                `}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop';
                                }}
                            />
                        ))}
                        {/* Gradient overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to top, rgba(33,16,0,0.9) 0%, rgba(33,16,0,0.4) 50%, transparent 100%)`,
                            }}
                        />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-3 py-1 rounded mb-4 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase">
                            ATP & WTA
                        </span>

                        <h1 className="font-manrope text-[clamp(32px,5vw,48px)] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-surface-bright)] mb-4">
                            Experience the Court Like Never Before
                        </h1>

                        <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-surface-variant)] mb-6">
                            Live scores, comprehensive statistics, player rankings, and tournament schedules across the globe.
                        </p>

                    </div>
                </div>

                {/* Today's Matches Section */}
                <section className="mb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="font-manrope text-[32px] md:text-[40px] font-extrabold tracking-tight text-[var(--color-on-surface)] m-0">
                                Upcoming Matches
                            </h2>
                        </div>
                        <Link to="/tennis/matches" className="hidden md:flex items-center gap-2 font-inter text-[13px] font-bold tracking-wide uppercase text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">
                            All Matches <MaterialIcon name="arrow_forward" className="text-[18px]" />
                        </Link>
                    </div>

                    {loadingMatches ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                            ))}
                        </div>
                    ) : matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {matches.slice(0, 6).map(match => (
                                <TennisMatchCard key={match.id || match.fixtureId} match={match} onClick={() => { }} />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full p-12 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                            <MaterialIcon name="sports_tennis" className="text-[48px] text-[var(--color-outline-variant)] mb-4" />
                            <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center">No matches scheduled for today.</p>
                        </div>
                    )}
                </section>

                {/* Featured Tournaments */}
                <section className="mb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="font-manrope text-[32px] md:text-[40px] font-extrabold tracking-tight text-[var(--color-on-surface)] m-0">
                                Featured Tournaments
                            </h2>
                        </div>
                        <Link to="/tennis/tournaments" className="hidden md:flex items-center gap-2 font-inter text-[13px] font-bold tracking-wide uppercase text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">
                            View Calendar <MaterialIcon name="arrow_forward" className="text-[18px]" />
                        </Link>
                    </div>

                    {loadingTournaments ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-48 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                            ))}
                        </div>
                    ) : tournaments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {tournaments.map(tournament => (
                                <TournamentCard key={tournament.id} tournament={tournament} onClick={() => { }} />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full p-12 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                            <MaterialIcon name="event_busy" className="text-[48px] text-[var(--color-outline-variant)] mb-4" />
                            <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center">No tournaments found.</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
