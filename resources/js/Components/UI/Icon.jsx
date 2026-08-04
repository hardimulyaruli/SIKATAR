import React from 'react';

export default function Icon({ name, className = '', fill = false, size }) {
    const fillStyle = fill ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" };
    const sizeStyle = size ? { fontSize: `${size}px` } : {};

    return (
        <span
            className={`material-symbols-outlined select-none ${className}`}
            style={{ ...fillStyle, ...sizeStyle }}
        >
            {name}
        </span>
    );
}
