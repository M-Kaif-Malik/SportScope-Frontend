import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../ui/MaterialIcon';

export const SecondaryNavbar = () => {
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Live / Upcoming', path: '/live' },
        { label: 'Series', path: '/series' },
        { label: 'Previous Matches', path: '/previous-matches' },
        { label: 'Players', path: '/players' },
    ];

    return (
        <div className="fixed top-16 w-full z-40 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20 shadow-sm hidden md:block">
            <div className="flex items-center w-full px-4 md:px-12 max-w-[1280px] mx-auto h-12">
                <nav className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.label} 
                            to={item.path} 
                            className="text-[13px] font-semibold tracking-wide uppercase text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors font-inter no-underline"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};
