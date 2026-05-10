import React, { useState } from 'react';
import { MaterialIcon } from '../ui/MaterialIcon';

export const TennisPlayerCard = ({ player, rank }) => {
    const [expanded, setExpanded] = useState(false);

    if (!player) return null;

    const name = player.name || 'Unknown Player';
    const country = player.country || '';
    const img = player.image || '';
    const points = player.points || 0;
    const birthday = player.birthday || 'N/A';

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="flex flex-col bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/10 p-4 rounded-lg hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all cursor-pointer w-full group"
        >
            <div className="flex items-center gap-4">
                {rank && (
                    <div className="flex-shrink-0 w-8 h-8 rounded bg-[var(--color-surface-variant)] flex items-center justify-center font-inter text-[12px] font-bold text-[var(--color-on-surface-variant)]">
                        {rank}
                    </div>
                )}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0 bg-[var(--color-surface-container-high)] flex items-center justify-center">
                    {img ? (
                        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <MaterialIcon name="person" className="text-[24px] text-[var(--color-on-surface-variant)]" />
                    )}
                </div>
                <div className="flex flex-col flex-grow">
                    <h4 className="font-manrope text-[16px] md:text-[18px] font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors m-0">
                        {name}
                    </h4>
                    {country && (
                        <span className="font-inter text-[10px] md:text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)]">
                            {country}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-center">
                    <MaterialIcon name={expanded ? "expand_less" : "expand_more"} className="text-[24px] text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
                </div>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/10 animate-fadeIn flex justify-between px-2">
                    <div className="flex flex-col">
                        <span className="text-[11px] text-[var(--color-on-surface-variant)] font-inter uppercase font-bold tracking-wider mb-1">Points</span>
                        <span className="text-[14px] font-manrope font-bold text-[var(--color-on-surface)]">{points.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
