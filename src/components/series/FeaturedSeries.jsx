import React, { useRef } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SeriesCard } from './SeriesCard';
import { series } from '../../constants/series';

export const FeaturedSeries = () => {
    const scrollRef = useRef(null);

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
                    showArrows={true}
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
                {series.map((s, idx) => (
                    <div key={idx} className="snap-start flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)]">
                        <SeriesCard {...s} />
                    </div>
                ))}
            </div>
        </section>
    );
};
