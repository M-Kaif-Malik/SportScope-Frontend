import React from 'react';

export const Footer = () => (
    <footer className="bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)]/10 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 px-4 md:px-12 max-w-[1280px] mx-auto gap-6">
            <div className="flex flex-col items-center md:items-start">
                <span className="text-[32px] font-bold text-[var(--color-primary)] mb-2 font-manrope">
                    SportsScope
                </span>
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-on-surface-variant)] font-inter">
                    Analytical rigor. Editorial warmth.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                {["About", "Privacy Policy", "Terms of Service", "Contact"].map((link) => (
                    <a
                        key={link}
                        href="#"
                        className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] no-underline font-inter hover:text-[var(--color-primary)] transition-colors"
                    >
                        {link}
                    </a>
                ))}
            </div>
            <div className="text-[16px] text-[var(--color-on-surface)] opacity-60 font-manrope">
                © 2024 SportsScope. All rights reserved.
            </div>
        </div>
    </footer>
);
