import React from 'react';

export const SeriesCard = ({ label, title, img }) => (
    <div className="relative rounded-xl overflow-hidden flex-shrink-0 group w-[300px] md:w-[350px] aspect-[4/3]">
        <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
        />
        <div className="absolute bottom-6 left-6 right-6">
            <span className="block font-inter text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--color-secondary-fixed)] mb-2">
                {label}
            </span>
            <h3 className="font-manrope text-[24px] font-semibold text-white">
                {title}
            </h3>
        </div>
    </div>
);
