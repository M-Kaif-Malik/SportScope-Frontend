import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';

import logoLight from '../../assets/images/logo.png';
import logoDark from '../../assets/images/logo-b2.png';

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState('Cricket');
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();

    const isTennis = location.pathname.startsWith('/tennis');

    useEffect(() => {
        // Check local storage or system preference on mount
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const toggleMenu = (item) => {
        setExpandedMenu(expandedMenu === item ? null : item);
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]/30 shadow-sm h-16">
            <div className="flex items-center justify-between w-full px-4 md:px-12 max-w-[1280px] mx-auto h-full">
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer no-underline">

                        { }
                        <img
                            src={isDark ? logoDark : logoLight}
                            alt="SportsScope Logo"
                            className="w-8 h-8 object-contain"
                        />

                        <span className="font-bold text-[20px] tracking-tight text-[var(--color-primary)] font-manrope">
                            SportsScope
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            to="/"
                            className={`text-[12px] font-semibold tracking-[0.08em] uppercase pb-1 no-underline font-inter ${!isTennis ? 'text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]' : 'text-[var(--color-on-surface-variant)] border-none'}`}
                        >
                            Cricket
                        </Link>
                        <Link
                            to="/tennis"
                            className={`text-[12px] font-semibold tracking-[0.08em] uppercase pb-1 no-underline font-inter ${isTennis ? 'text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]' : 'text-[var(--color-on-surface-variant)] border-none'}`}
                        >
                            Tennis
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-[var(--color-surface-variant)] transition-colors border-none bg-transparent cursor-pointer text-[var(--color-on-surface)] flex items-center justify-center"
                    >
                        <MaterialIcon name={isDark ? "light_mode" : "dark_mode"} />
                    </button>

                    <button
                        className="md:hidden p-2 border-none bg-transparent cursor-pointer text-[var(--color-on-surface)] flex items-center justify-center"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <MaterialIcon name={menuOpen ? "close" : "menu"} />
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden px-4 pb-4 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]">
                    {["Cricket", "Tennis"].map((item) => (
                        <div key={item} className="border-b border-[var(--color-outline-variant)]/20 last:border-0">
                            <button
                                onClick={() => toggleMenu(item)}
                                className="w-full flex items-center justify-between py-4 text-[14px] font-bold tracking-[0.05em] uppercase text-[var(--color-on-surface)] bg-transparent border-none cursor-pointer"
                            >
                                {item}
                                <MaterialIcon name={expandedMenu === item ? "expand_less" : "expand_more"} />
                            </button>

                            {expandedMenu === item && (
                                <div className="pb-4 pl-4 flex flex-col gap-4 border-l-2 border-[var(--color-border)] ml-2">
                                    {item === "Cricket" ? (
                                        <>
                                            <Link to="/" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Home</Link>
                                            <Link to="/live" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Live Matches</Link>
                                            <Link to="/series" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Series</Link>
                                            <Link to="/previous-matches" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Previous Matches</Link>
                                            <Link to="/players" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Players</Link>
                                        </>
                                    ) : item === "Tennis" ? (
                                        <>
                                            <Link to="/tennis" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Home</Link>
                                            <Link to="/tennis/matches" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Matches</Link>
                                            <Link to="/tennis/tournaments" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Tournaments</Link>
                                            <Link to="/tennis/players" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Players</Link>
                                            <Link to="/tennis/rankings" onClick={() => setMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] no-underline uppercase transition-colors">Rankings</Link>
                                        </>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};