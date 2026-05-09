import React from 'react';

export const MaterialIcon = ({ name, className = "", style = {} }) => (
    <span className={`material-symbols-outlined ${className}`} style={style}>
        {name}
    </span>
);
