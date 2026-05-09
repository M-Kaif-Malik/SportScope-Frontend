import React from 'react';
import { IconButton } from './IconButton';

export const SectionHeader = ({ title, subtitle, showArrows = false, onPrev, onNext }) => (
    <div className="flex justify-between items-end mb-6">
        <div>
            <h2 className="text-[32px] font-bold tracking-[-0.01em] text-[var(--color-primary)] font-manrope">
                {title}
            </h2>
            {subtitle && (
                <p className="text-[16px] text-[var(--color-on-surface-variant)] font-manrope">
                    {subtitle}
                </p>
            )}
        </div>
        {showArrows && (
            <div className="flex gap-2">
                <IconButton
                    icon="chevron_left"
                    onClick={onPrev}
                    className="w-10 h-10 rounded-full bg-transparent hover:bg-gray-200 border border-[var(--color-outline-variant)]/30 cursor-pointer"
                />
                <IconButton
                    icon="chevron_right"
                    onClick={onNext}
                    className="w-10 h-10 rounded-full bg-transparent hover:bg-gray-200 border border-[var(--color-outline-variant)]/30 cursor-pointer"
                />
            </div>
        )}
    </div>
);
