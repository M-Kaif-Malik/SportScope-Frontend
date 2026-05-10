import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SeriesCard = ({ id, label, title, img, teamImages }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (id) {
            navigate(`/series?seriesId=${id}`);
        }
    };

    return (
        <div 
            className="relative rounded-xl overflow-hidden flex-shrink-0 group w-full aspect-[4/3] cursor-pointer"
            onClick={handleClick}
        >
            {teamImages && teamImages.length >= 2 ? (
                <div className="absolute inset-0 flex bg-[var(--color-surface)]">
                    <img src={teamImages[0]} className="w-1/2 h-full object-cover blur-sm opacity-60 transition-transform duration-500 group-hover:scale-110" alt="Team 1" />
                    <img src={teamImages[1]} className="w-1/2 h-full object-cover blur-sm opacity-60 transition-transform duration-500 group-hover:scale-110" alt="Team 2" />
                </div>
            ) : (
                <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            )}
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
};
