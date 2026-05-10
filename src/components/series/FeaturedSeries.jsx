import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { SectionHeader } from '../ui/SectionHeader';
import { SeriesCard } from './SeriesCard';

export const FeaturedSeries = () => {
    const scrollRef = useRef(null);
    const [featuredSeries, setFeaturedSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedSeries = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/series/upcoming?format=all&status=all`);
                
                const topSeries = response.data.series.slice(0, 5);
                
                const seriesWithImages = await Promise.all(
                    topSeries.map(async (s) => {
                        let teamImages = null;
                        try {
                            const detailsRes = await axios.get(`http://localhost:5000/api/series/${s.seriesId}`);
                            if (detailsRes.data.series && detailsRes.data.series.matchList) {
                                const firstMatchWithTeams = detailsRes.data.series.matchList.find(m => m.teamInfo && m.teamInfo.length >= 2);
                                if (firstMatchWithTeams) {
                                    teamImages = [firstMatchWithTeams.teamInfo[0].img, firstMatchWithTeams.teamInfo[1].img];
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching details for series ${s.seriesId}`, err);
                        }

                        const formats = [];
                        if (s.t20 > 0) formats.push(`${s.t20} T20s`);
                        if (s.odi > 0) formats.push(`${s.odi} ODIs`);
                        if (s.test > 0) formats.push(`${s.test} Tests`);

                        return {
                            id: s.seriesId,
                            title: s.name,
                            label: formats.length > 1 ? 'Multi-format' : (s.t20 > 0 ? 'T20' : s.odi > 0 ? 'ODI' : s.test > 0 ? 'Test' : 'International'),
                            img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000',
                            teamImages
                        };
                    })
                );

                setFeaturedSeries(seriesWithImages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching featured series:", error);
                setLoading(false);
            }
        };

        fetchFeaturedSeries();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 350; // Approx card width
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full mt-12 bg-[var(--color-surface-container-low)] py-12">
            <div className="px-4 md:px-12 max-w-[1280px] mx-auto">
                <SectionHeader 
                    title="Featured Series" 
                    subtitle="Explore the most anticipated tournaments of the season."
                    showArrows={!loading}
                    onPrev={() => scroll('left')}
                    onNext={() => scroll('right')}
                />
            </div>
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-4 md:px-12 pb-6 snap-x snap-mandatory max-w-[1280px] mx-auto"
                style={{ scrollbarWidth: "none" /* Firefox */ }}
            >
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style>{`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {loading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                            <div className="relative rounded-xl overflow-hidden flex-shrink-0 w-full aspect-[4/3] bg-[var(--color-surface-variant)] animate-pulse"></div>
                        </div>
                    ))
                ) : (
                    featuredSeries.map((s, idx) => (
                        <div key={idx} className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                            <SeriesCard {...s} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
