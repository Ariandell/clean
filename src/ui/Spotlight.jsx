import React, { useRef, useState, useEffect } from "react";

export const Spotlight = ({ className = "" }) => {
    const divRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`absolute inset-0 overflow-hidden bg-slate-50 ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.1), transparent 40%)`,
                }}
            />


            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                    backgroundSize: `32px 32px`,
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
            />


            <div
                className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 blur-3xl"
            />
        </div>
    );
};
