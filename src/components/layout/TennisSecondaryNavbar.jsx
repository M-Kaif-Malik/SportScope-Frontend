import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const TennisSecondaryNavbar = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/tennis' },
        { label: 'Matches', path: '/tennis/matches' },
        { label: 'Tournaments', path: '/tennis/tournaments' },
        { label: 'Rankings', path: '/tennis/rankings' },
    ];

    return (
        <div className="fixed top-16 w-full z-40 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20 shadow-sm hidden md:block">
            <div className="flex items-center w-full px-4 md:px-12 max-w-[1280px] mx-auto h-12">
                <nav className="flex items-center gap-8">
                    {navItems.map((item) => {
                        // Exact match for Home to prevent highlighting it on all /tennis routes
                        const isActive = item.path === '/tennis'
                            ? location.pathname === '/tennis'
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`text-[13px] font-semibold tracking-wide uppercase transition-colors font-inter no-underline ${isActive
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
