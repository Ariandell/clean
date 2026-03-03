import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BeforeAfter = () => {
    const { t } = useLanguage();
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = useCallback((event) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;


        let newPos = ((clientX - containerRect.left) / containerRect.width) * 100;


        newPos = Math.min(100, Math.max(0, newPos));

        setSliderPosition(newPos);
    }, []);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);


    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (isDragging) {
                handleMove(e);
            }
        };
        const handleGlobalUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchmove', handleGlobalMove);
            window.addEventListener('touchend', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [isDragging, handleMove]);


    const handleContainerClick = (e) => {
        handleMove(e);
    };

    return (
        <section className="relative w-full bg-black py-20 overflow-hidden">

            <div className="relative z-10 text-center mb-12 px-6">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                    {t('beforeAfter.title')}
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    {t('beforeAfter.subtitle')}
                </p>
            </div>


            <div
                ref={containerRef}
                className="relative w-full max-w-7xl mx-auto aspect-[16/9] md:h-[70vh] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onClick={handleContainerClick}
            >

                <div className="absolute inset-0">
                    <img
                        src="/images/uborka-posle.jpg"
                        alt="Clean"
                        loading="lazy"
                        className="w-full h-full object-cover"
                        draggable="false"
                    />
                    <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-bold tracking-wider">
                        {t('beforeAfter.after')}
                    </div>
                </div>


                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src="/images/uborka-do.jpg"
                        alt="Dirty"
                        loading="lazy"
                        className="w-full h-full object-cover"
                        draggable="false"
                    />
                    <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-bold tracking-wider">
                        {t('beforeAfter.before')}
                    </div>
                </div>


                <div
                    className="absolute top-0 bottom-0 w-1 bg-white z-20"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center transform hover:scale-110 transition-transform">
                        <ArrowLeftRight className="w-6 h-6 text-black" />
                    </div>
                </div>
            </div>


            <div className="text-center mt-8 text-white/30 text-sm font-mono tracking-widest uppercase animate-pulse">
                {t('beforeAfter.dragHint')}
            </div>
        </section>
    );
};
