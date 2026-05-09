import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SecondaryNavbar } from '../components/layout/SecondaryNavbar';
import { Footer } from '../components/layout/Footer';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { fetchPlayerById } from '../services/playerApi';

export default function PlayerDetail() {
    const { playerId } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        fetchPlayerById(playerId)
            .then(res => setPlayer(res.player))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [playerId]);

    if (loading) {
        return (
            <div className="bg-[var(--color-surface)] min-h-screen">
                <Header /><SecondaryNavbar />
                <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[112px] flex justify-center items-center">
                    <MaterialIcon name="refresh" className="animate-spin text-[32px] text-[var(--color-on-surface-variant)] mt-20" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!player) {
        return (
            <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)]">
                <Header /><SecondaryNavbar />
                <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[112px] flex flex-col items-center">
                    <h2 className="font-manrope text-[32px] font-bold mt-20 mb-4 text-[var(--color-primary)]">Player Not Found</h2>
                    <button onClick={() => navigate('/players')} className="px-6 py-2 rounded-full bg-[var(--color-secondary)] text-[var(--color-on-secondary)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase border-none cursor-pointer">
                        Back to Directory
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <SecondaryNavbar />

            <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 pt-[112px] mt-6">
                
                <button onClick={() => navigate('/players')} className="flex items-center gap-2 mb-8 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors bg-transparent border-none cursor-pointer font-inter text-[12px] font-semibold tracking-[0.08em] uppercase">
                    <MaterialIcon name="arrow_back" /> Back to Search
                </button>

                <section className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Large Profile Visual */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[var(--color-primary)]/10 shadow-md relative group">
                                <img src={player.image} alt={player.name.full} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-white bg-[var(--color-secondary)] px-3 py-1 rounded-full inline-block">
                                        ID: {player.playerId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info & Stats */}
                        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                            <header className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)] tracking-widest flex items-center gap-2">
                                        {player.position} • {player.country.name} 
                                        {player.country.image && player.country.image.startsWith('http') ? (
                                            <img src={player.country.image} alt={player.country.name} className="w-6 h-4 inline-block object-cover rounded-sm border border-[var(--color-outline-variant)]" />
                                        ) : (
                                            <span>{player.country.image}</span>
                                        )}
                                    </span>
                                </div>
                                <h1 className="font-manrope text-[48px] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-primary)]">
                                    {player.name.full}
                                </h1>
                                <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-on-surface-variant)] max-w-2xl">
                                    Elite {player.position.toLowerCase()} from {player.country.name} ({player.country.continent}). Known for exceptional skills on the pitch and consistent performances.
                                </p>
                            </header>

                            {/* Tactical Analytics Row */}
                            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--color-outline-variant)]/20">
                                <div>
                                    <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-1">Batting Style</span>
                                    <span className="font-manrope text-[24px] md:text-[32px] font-bold tracking-[-0.01em] leading-none text-[var(--color-primary)] capitalize">
                                        {player.battingStyle.replace(/-/g, ' ')}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-1">Bowling Style</span>
                                    <span className="font-manrope text-[24px] md:text-[32px] font-bold tracking-[-0.01em] leading-none text-[var(--color-primary)] capitalize">
                                        {player.bowlingStyle ? player.bowlingStyle.replace(/-/g, ' ') : "None"}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] block mb-1">DOB</span>
                                    <span className="font-manrope text-[24px] md:text-[32px] font-bold tracking-[-0.01em] leading-none text-[var(--color-primary)]">
                                        {player.dateOfBirth}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
