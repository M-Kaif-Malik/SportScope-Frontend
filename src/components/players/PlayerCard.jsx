import React from 'react';

export const PlayerCard = ({ name, role, img }) => (
    <div className="text-center group cursor-pointer">
        <div className="mx-auto rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl w-32 h-32 md:w-40 md:h-40 border-4 border-[var(--color-surface-container-high)]">
            <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <h4 className="font-manrope text-[20px] md:text-[24px] font-semibold mt-4 text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
            {name}
        </h4>
        <span className="font-inter text-[10px] md:text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary)]">
            {role}
        </span>
    </div>
);
