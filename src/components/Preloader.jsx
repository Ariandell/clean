import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Preloader = ({ onComplete }) => {
    const { t } = useLanguage();
    const words = t('preloader.words');
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState('loading');
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobile);


        const staticLoader = document.getElementById('static-loader');
        if (staticLoader) {
            staticLoader.style.opacity = '0';
            setTimeout(() => staticLoader.remove(), 500);
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (index === words.length - 1 && !hasCompletedRef.current) {

            const floodTimer = setTimeout(() => {
                setPhase('flood');

                setTimeout(() => {
                    setPhase('scatter');
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;
                        onComplete();
                    }
                }, 600);
            }, 1000);
            return () => clearTimeout(floodTimer);
        }

        if (index < words.length - 1) {
            const timer = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [index, onComplete]);

    const isScattering = phase === 'scatter';
    const isFlooding = phase === 'flood';
    const isExiting = isFlooding || isScattering;


    const blobSize = isMobile ? '100%' : '175%';
    const blobBlur = isMobile ? '24px' : '80px';
    const blobScale = isMobile ? 0.35 : 0.4;

    return (
        <motion.div
            className="fixed top-0 left-0 w-full h-[calc(var(--vh,1vh)*100)] z-[9999] flex items-center justify-center text-white overflow-hidden"
            initial={{ backgroundColor: 'rgba(10, 10, 10, 1)' }}
            animate={{
                backgroundColor: isScattering ? 'rgba(10, 10, 10, 0)' : 'rgba(10, 10, 10, 1)',
            }}
            transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{ pointerEvents: isScattering ? 'none' : 'auto' }}
            exit={{
                backgroundColor: 'rgba(10, 10, 10, 0)',
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
        >

            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '-30%',
                        left: '-20%',
                        width: blobSize,
                        height: isMobile ? '120%' : '200%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(45, 112, 145, 0.35) 0%, rgba(30, 80, 120, 0.2) 40%, transparent 70%)',
                        filter: `blur(${blobBlur})`,
                        willChange: 'transform',
                    }}
                    animate={
                        isFlooding ? { x: '12%', y: '16%', scale: 1, opacity: 1 } :
                            isScattering ? { x: '-20%', y: '-20%', scale: 0.1, opacity: 0 } :
                                { x: [0, 24, -16, 8, 0], y: [0, 20, -12, 16, 0], scale: [0.4, 0.46, 0.36, 0.44, 0.4] }
                    }
                    transition={isExiting ? { duration: 1, ease: [0.22, 1, 0.36, 1] } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    exit={{ x: '-20%', y: '-20%', scale: 0.1, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
                />


                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '-30%',
                        right: '-20%',
                        width: '175%',
                        height: '200%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(100, 70, 140, 0.35) 0%, rgba(80, 50, 120, 0.2) 40%, transparent 70%)',
                        filter: 'blur(80px)',
                        willChange: 'transform',
                    }}
                    animate={
                        isFlooding ? { x: '-12%', y: '-16%', scale: 1, opacity: 1 } :
                            isScattering ? { x: '20%', y: '20%', scale: 0.1, opacity: 0 } :
                                { x: [0, -24, 16, -8, 0], y: [0, -20, 12, -16, 0], scale: [0.4, 0.36, 0.46, 0.38, 0.4] }
                    }
                    transition={isExiting ? { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.05 } : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    exit={{ x: '20%', y: '20%', scale: 0.1, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.05 } }}
                />


                <motion.div
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '15%',
                        width: '85%',
                        height: '110%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(160, 100, 130, 0.22) 0%, transparent 60%)',
                        filter: 'blur(60px)',
                        willChange: 'transform',
                    }}
                    animate={
                        isFlooding ? { x: '-20%', y: '15%', scale: 1, opacity: 0.9 } :
                            isScattering ? { x: '25%', y: '-25%', scale: 0.1, opacity: 0 } :
                                { x: [0, -35, 25, -15, 0], y: [0, 20, -25, 15, 0], scale: [0.4, 0.48, 0.34, 0.44, 0.4] }
                    }
                    transition={isExiting ? { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    exit={{ x: '25%', y: '-25%', scale: 0.1, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }}
                />


                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '10%',
                        width: '75%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(60, 140, 160, 0.22) 0%, transparent 60%)',
                        filter: 'blur(55px)',
                        willChange: 'transform',
                    }}
                    animate={
                        isFlooding ? { x: '25%', y: '-15%', scale: 1, opacity: 0.9 } :
                            isScattering ? { x: '-25%', y: '25%', scale: 0.1, opacity: 0 } :
                                { x: [0, 30, -20, 25, 0], y: [0, -18, 28, -12, 0], scale: [0.4, 0.36, 0.48, 0.38, 0.4] }
                    }
                    transition={isExiting ? { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 } : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    exit={{ x: '-25%', y: '25%', scale: 0.1, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 } }}
                />


                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '125%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(80, 90, 130, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        willChange: 'transform',
                    }}
                    animate={
                        isFlooding ? { scale: 1.2, opacity: 1 } :
                            isScattering ? { scale: 0.2, opacity: 0 } :
                                { scale: [0.4, 0.52, 0.36, 0.48, 0.4], opacity: [0.5, 0.9, 0.4, 0.7, 0.5] }
                    }
                    transition={isExiting ? { duration: 1, ease: [0.22, 1, 0.36, 1] } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    exit={{ scale: 0.2, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
                />
            </div>


            <motion.div
                className="relative z-10 text-center"
                animate={isExiting ? { opacity: 0, scale: 0.85, y: -30, filter: 'blur(15px)' } : {}}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                exit={{ opacity: 0, scale: 0.85, y: -30, filter: 'blur(15px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            >
                {!isExiting && words.map((word, i) => (
                    i === index && (
                        <motion.div
                            key={word}
                            className="overflow-hidden h-[calc(var(--vh,1vh)*12)] flex items-center justify-center"
                        >
                            <motion.h1
                                className="text-[calc(var(--vh,1vh)*10)] font-bold tracking-tighter uppercase leading-none"
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                exit={{ y: "-100%", opacity: 0 }}
                                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                            >
                                {word}
                            </motion.h1>
                        </motion.div>
                    )
                ))}



                {!isExiting && (
                    <motion.div
                        style={{
                            width: '160px',
                            height: '2px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            marginTop: '32px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            overflow: 'hidden',
                            borderRadius: '2px',
                        }}
                    >
                        <motion.div
                            style={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.8)' }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4.5, ease: "linear" }}
                        />
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};
