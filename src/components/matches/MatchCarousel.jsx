import React, { useRef } from 'react';
import { MatchCard } from './MatchCard';
import { IconButton } from '../ui/IconButton';
import { matches } from '../../constants/matches';

export const MatchCarousel = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400; // Approx card width
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full mt-6 relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-8 z-10 hidden md:block">
                <IconButton
                    icon="chevron_left"
                    onClick={() => scroll('left')}
                    className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-md hover:bg-gray-100 border border-[var(--color-outline-variant)]/30"
                />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-8 z-10 hidden md:block">
                <IconButton
                    icon="chevron_right"
                    onClick={() => scroll('right')}
                    className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-md hover:bg-gray-100 border border-[var(--color-outline-variant)]/30"
                />
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-4 md:px-12 max-w-[1280px] mx-auto pb-8 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" /* Firefox */ }}
            >
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style>{`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {matches.map((match) => (
                    <div key={match.id} className="snap-start flex-shrink-0">
                        <MatchCard {...match} />
                    </div>
                ))}
            </div>
        </section>
    );
};
