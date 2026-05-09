import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]/30 shadow-sm h-16">
            <div className="flex items-center justify-between w-full px-4 md:px-12 max-w-[1280px] mx-auto h-full">
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline">
                        <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)]">
                            <MaterialIcon name="sports_cricket" />
                        </div>
                        <span className="font-bold text-[20px] tracking-tight text-[var(--color-primary)] font-manrope">SportsScope</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {["Cricket", "Football", "Basketball"].map((item, i) => (
                            <a
                                key={item}
                                href="#"
                                className={`text-[12px] font-semibold tracking-[0.08em] uppercase pb-1 no-underline font-inter ${i === 0 ? 'text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]' : 'text-[var(--color-on-surface-variant)] border-none'}`}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <MaterialIcon name="dark_mode" />
                    </button>
                    <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        <MaterialIcon name="menu" />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]">
                    {["Cricket", "Football", "Basketball"].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="block py-2 text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-on-surface-variant)] no-underline font-inter"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
};
