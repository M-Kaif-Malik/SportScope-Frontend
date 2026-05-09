import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export const CarouselNavButton = ({ direction, onClick, className = "", style = {} }) => {
    const iconName = direction === 'left' ? 'chevron_left' : 'chevron_right';
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 min-w-10 min-h-10 rounded-full flex items-center justify-center bg-transparent border border-[var(--color-outline-variant)]/30 cursor-pointer hover:bg-gray-200 transition-colors ${className}`}
            style={style}
            aria-label={`Scroll ${direction}`}
        >
            <MaterialIcon name={iconName} className="text-[var(--color-on-surface)]" />
        </button>
    );
};
