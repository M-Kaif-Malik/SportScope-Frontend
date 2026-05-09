import React, { useEffect, useState } from 'react';

// 1. Import your images from assets
import img1 from '../../assets/images/ashes.webp';
import img2 from '../../assets/images/india.webp';
import img3 from '../../assets/images/nz.webp';
import img4 from "../../assets/images/pakistan.jpg";

const images = [img1, img2, img3, img4];

export const HeroSection = () => {
    const [index, setIndex] = useState(0);
    const [hover, setHover] = useState(false);

    // Auto slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full px-4 md:px-12 max-w-[1280px] mx-auto mt-6">
            <div
                className="relative rounded-xl overflow-hidden flex items-end p-6 md:p-12 min-h-[500px]"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >

                {/* IMAGE SLIDER */}
                <div className="absolute inset-0 z-0">
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`hero-${i}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                                ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
                                ${hover ? 'scale-110' : ''}
                            `}
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

                {/* CONTENT */}
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 rounded mb-4 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-inter text-[12px] font-semibold tracking-[0.08em] uppercase">
                        LIVE SCORES & SERIES
                    </span>

                    <h1 className="font-manrope text-[clamp(32px,5vw,48px)] font-extrabold tracking-[-0.02em] leading-[1.1] text-[var(--color-surface-bright)] mb-4">
                        Everything Cricket. One Simple Experience.
                    </h1>

                    <p className="font-manrope text-[18px] leading-[1.6] text-[var(--color-surface-variant)] mb-6">
                        Track live matches, browse series, explore players, and stay connected with the latest cricket action worldwide.
                    </p>

                    <button className="bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed)] px-8 py-3 rounded-lg font-inter text-[12px] font-semibold tracking-[0.08em] uppercase border-none cursor-pointer hover:bg-[var(--color-secondary-fixed-dim)] transition-colors">
                        View Live Matches
                    </button>
                </div>

            </div>
        </section>
    );
};