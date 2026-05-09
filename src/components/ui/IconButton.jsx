import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export const IconButton = ({
    icon,
    onClick,
    className = "",
    style = {},
    ariaLabel = "icon button",
}) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`
            flex-shrink-0
            w-10 h-10
            rounded-full
            flex items-center justify-center
            bg-transparent
            hover:bg-[var(--color-surface-container)]
            active:scale-95
            transition-all duration-200
            ${className}
        `}
        style={style}
    >
        <MaterialIcon
            name={icon}
            className="
                text-[20px]
                leading-none
                text-[var(--color-on-surface)]
            "
        />
    </button>
);