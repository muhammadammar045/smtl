"use client";

import React from "react";

// ✅ Define your own variants
type LoaderVariant = "infinite" | "ring" | "bars" | "dots";

interface LoaderProps {
    variant?: LoaderVariant; // gives IntelliSense suggestions
    size?: number; // optional numeric size
}

const Loader: React.FC<LoaderProps> = ({ variant = "infinite", size = 40 }) => {
    const commonStyle = `h-[${size}px] w-[${size}px] border-4 border-primary`;

    switch (variant) {
        case "ring":
            return (
                <div
                    className={`${commonStyle} rounded-full border-t-transparent animate-spin`}
                />
            );

        case "bars":
            return (
                <div className='flex items-center gap-1'>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className='w-2 h-6 bg-primary animate-bounce'
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            );

        case "dots":
            return (
                <div className='flex items-center gap-1'>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className='w-2 h-2 rounded-full bg-primary animate-bounce'
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            );

        case "infinite":
        default:
            return (
                <div
                    className={`${commonStyle} rounded-full border-t-transparent animate-spin`}
                />
            );
    }
};

export default Loader;
