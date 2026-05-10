import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { TournamentCard } from '../../components/tennis/TournamentCard';
import { getTournamentCalendar } from '../../services/tennisApi';
import { MaterialIcon } from '../../components/ui/MaterialIcon';

export default function TennisTournaments() {
    const [tourType, setTourType] = useState('atp'); // 'atp' or 'wta'
    const [year, setYear] = useState(new Date().getFullYear());
    
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchTournaments = async () => {
            setLoading(true);
            try {
                const res = await getTournamentCalendar(year, tourType);
                setTournaments(res?.tournaments || []);
                setCurrentPage(1);
            } catch (err) {
                console.error("Failed to load tournaments", err);
                setTournaments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, [tourType, year]);

    const totalPages = Math.ceil(tournaments.length / itemsPerPage);
    const currentTournaments = tournaments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-manrope">
            <Header />
            <TennisSecondaryNavbar />
            <main className="pt-[144px] pb-24 px-4 md:px-12 max-w-[1280px] mx-auto min-h-screen">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight leading-[1.1] mb-2 text-[var(--color-on-surface)]">
                            Tournament Calendar
                        </h1>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)]">
                            Explore the entire tennis season schedule and past results.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Year Selector (Simple) */}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setYear(year - 1)} className="p-1 rounded bg-[var(--color-surface-container)] border-none cursor-pointer"><MaterialIcon name="chevron_left" /></button>
                            <span className="font-manrope font-bold text-[18px]">{year}</span>
                            <button onClick={() => setYear(year + 1)} className="p-1 rounded bg-[var(--color-surface-container)] border-none cursor-pointer"><MaterialIcon name="chevron_right" /></button>
                        </div>
                        {/* ATP / WTA Toggle */}
                        <div className="flex bg-[var(--color-surface-container-high)] rounded-lg p-1 w-max self-end">
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
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-48 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                        ))}
                    </div>
                ) : currentTournaments.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentTournaments.map(tournament => (
                                <TournamentCard key={tournament.id} tournament={tournament} tourType={tourType} />
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--color-outline-variant)]/20">
                                <button 
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-inter text-[14px] font-bold transition-colors ${currentPage === 1 ? 'text-[var(--color-on-surface-variant)]/50 cursor-not-allowed' : 'text-[var(--color-on-surface)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] cursor-pointer border-none'}`}
                                >
                                    <MaterialIcon name="chevron_left" className="text-[20px]" />
                                    Previous
                                </button>
                                <span className="font-inter text-[14px] font-medium text-[var(--color-on-surface-variant)]">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-inter text-[14px] font-bold transition-colors ${currentPage === totalPages ? 'text-[var(--color-on-surface-variant)]/50 cursor-not-allowed' : 'text-[var(--color-on-surface)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] cursor-pointer border-none'}`}
                                >
                                    Next
                                    <MaterialIcon name="chevron_right" className="text-[20px]" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full py-24 flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] rounded-xl border border-dashed border-[var(--color-outline-variant)]/30">
                        <MaterialIcon name="event_busy" className="text-[64px] text-[var(--color-outline-variant)] mb-4 opacity-50" />
                        <h3 className="font-manrope text-[20px] font-bold text-[var(--color-on-surface)] mb-2">No Tournaments Found</h3>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center max-w-md">
                            No tournament data available for {tourType.toUpperCase()} in {year}.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
