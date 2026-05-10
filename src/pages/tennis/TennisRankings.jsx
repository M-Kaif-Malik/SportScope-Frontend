import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { TennisSecondaryNavbar } from '../../components/layout/TennisSecondaryNavbar';
import { Footer } from '../../components/layout/Footer';
import { TennisPlayerCard } from '../../components/tennis/TennisPlayerCard';
import { getSinglesRankings, getDoublesRankings, getRaceRankings } from '../../services/tennisApi';
import { MaterialIcon } from '../../components/ui/MaterialIcon';

export default function TennisRankings() {
    const [tourType, setTourType] = useState('atp'); // 'atp' or 'wta'
    const [rankingCategory, setRankingCategory] = useState('singles'); // 'singles', 'doubles', 'race'
    
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                let res;
                if (rankingCategory === 'singles') {
                    res = await getSinglesRankings(tourType);
                } else if (rankingCategory === 'doubles') {
                    res = await getDoublesRankings(tourType);
                } else {
                    res = await getRaceRankings(tourType);
                }
                
                let data = res?.rankings || res?.data?.rankings || res || [];
                if (!Array.isArray(data)) {
                    data = [];
                }
                
                setRankings(data);
                setCurrentPage(1);
            } catch (err) {
                console.error("Failed to load rankings", err);
                setRankings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [tourType, rankingCategory]);

    const totalPages = Math.ceil(rankings.length / itemsPerPage);
    const currentRankings = rankings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                            Official Rankings
                        </h1>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)]">
                            Live updated standings for Singles, Doubles, and the Race.
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

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-[var(--color-outline-variant)]/20 mb-8 overflow-x-auto hide-scrollbar">
                    {['singles', 'doubles', 'race'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setRankingCategory(tab)}
                            className={`pb-4 px-2 font-inter text-[13px] font-bold tracking-wide uppercase transition-colors whitespace-nowrap border-none bg-transparent cursor-pointer ${
                                rankingCategory === tab 
                                    ? 'text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]' 
                                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border-b-2 border-transparent'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-24 bg-[var(--color-surface-container-high)] animate-pulse rounded-lg border border-[var(--color-outline-variant)]/10"></div>
                        ))}
                    </div>
                ) : currentRankings.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentRankings.map((playerObj, idx) => {
                                let rank, points;
                                if (rankingCategory === 'doubles') {
                                    rank = playerObj.position;
                                    points = playerObj.pts;
                                } else if (rankingCategory === 'race') {
                                    rank = playerObj.racePosition;
                                    points = playerObj.racePoints;
                                } else {
                                    rank = playerObj.position;
                                    points = playerObj.point;
                                }
                                
                                const p = playerObj.player || {};
                                const name = p.name || 'Unknown';
                                
                                const player = {
                                    name: name,
                                    country: p.countryAcr || '', 
                                    image: '', 
                                    points: points,
                                    birthday: p.birthday ? new Date(p.birthday).toLocaleDateString() : ''
                                };

                                return (
                                    <TennisPlayerCard 
                                        key={playerObj.id || p.id || idx} 
                                        player={player} 
                                        rank={rank}
                                    />
                                );
                            })}
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
                        <MaterialIcon name="leaderboard" className="text-[64px] text-[var(--color-outline-variant)] mb-4 opacity-50" />
                        <h3 className="font-manrope text-[20px] font-bold text-[var(--color-on-surface)] mb-2">No Rankings Found</h3>
                        <p className="font-inter text-[14px] text-[var(--color-on-surface-variant)] text-center max-w-md">
                            Rankings for {tourType.toUpperCase()} {rankingCategory} are currently unavailable.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
