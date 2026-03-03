import React from 'react';

export const GlassCard = ({ children, className = '' }) => (
    <div className={`relative rounded-2xl border border-white/[0.12] bg-[#1a1a1e]/60 backdrop-blur-3xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-2xl" />
        {children}
    </div>
);
