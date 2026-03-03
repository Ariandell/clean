import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Slide = ({ item }) => {
    return (
        <div className="relative w-screen h-[calc(var(--vh,1vh)*100)] flex-shrink-0 flex items-center justify-center p-6 md:p-20 overflow-hidden">

            <div className="absolute inset-0 z-0">
                <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl w-full items-center">
                <div className="space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
                    >
                        {item.subtitle}
                    </motion.span>
                    <motion.h3
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter"
                    >
                        {item.title}
                    </motion.h3>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                >
                    <p className="text-xl text-white/90 leading-relaxed font-light">
                        {item.description}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export const HorizontalGallery = ({ onVisibilityChange }) => {
    const { t } = useLanguage();
    const targetRef = useRef(null);
    const mobileContainerRef = useRef(null);

    const images = [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop"
    ];

    const slidesData = t('gallery.slides', { returnObjects: true }) || [];
    const slides = slidesData.map((slide, index) => ({
        ...slide,
        image: images[index]
    }));



    const isMobileInView = useInView(mobileContainerRef, { amount: 0.6, margin: "0px 0px -100px 0px" });

    useEffect(() => {
        if (onVisibilityChange) {
            onVisibilityChange(isMobileInView);
        }
    }, [isMobileInView, onVisibilityChange]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end']
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);



    const [activeSlide, setActiveSlide] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {

        intervalRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [activeSlide]);

    const handleMobileScroll = () => { };

    return (
        <section className="bg-transparent">

            <div ref={targetRef} className="hidden md:block relative h-[400vh]">
                <div className="sticky top-0 flex h-[calc(var(--vh,1vh)*100)] items-center overflow-hidden">
                    <motion.div style={{ x }} className="flex will-change-transform">
                        {slides.map((slide, i) => (
                            <Slide key={i} item={slide} />
                        ))}
                    </motion.div>
                </div>
                <div className="absolute bottom-10 left-10 z-20 mix-blend-difference pointer-events-none">
                    <span className="text-white font-bold uppercase tracking-widest text-xs">
                        {t('gallery.scrollHint')}
                    </span>
                </div>
            </div>


            <div ref={mobileContainerRef} className="md:hidden relative h-[calc(var(--vh,1vh)*100)] w-full flex flex-col justify-center overflow-hidden">



                <div className="absolute top-4 left-0 right-0 z-50 flex gap-1.5 px-3">
                    {slides.map((_, i) => {
                        const isPast = i < activeSlide;
                        const isActive = i === activeSlide;
                        return (
                            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    key={`${i}-${isActive ? 'active' : isPast ? 'past' : 'future'}`}
                                    className="h-full bg-white"
                                    initial={{ width: isPast ? "100%" : "0%" }}
                                    animate={{ width: isPast ? "100%" : isActive ? "100%" : "0%" }}
                                    transition={{ duration: isActive ? 5 : 0, ease: "linear" }}
                                />
                            </div>
                        );
                    })}
                </div>


                <div className="absolute inset-0 z-40 flex">
                    <div
                        className="w-1/3 h-full"
                        onClick={() => {
                            if (activeSlide > 0) setActiveSlide(prev => prev - 1);
                        }}
                    />
                    <div
                        className="w-full h-full"
                        onPointerDown={() => clearInterval(intervalRef.current)}
                        onPointerUp={() => {
                        }}
                    />
                    <div
                        className="w-1/3 h-full absolute right-0"
                        onClick={() => {
                            if (activeSlide < slides.length - 1) setActiveSlide(prev => prev + 1);
                            else setActiveSlide(0);
                        }}
                    />
                </div>


                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative h-full w-full"
                    >

                        <div className="absolute inset-0 overflow-hidden">
                            <motion.img
                                src={slides[activeSlide].image}
                                alt={slides[activeSlide].title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.15 }}
                                transition={{ duration: 7, ease: "linear" }}
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                        </div>


                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 z-30 flex flex-col justify-end h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="inline-block px-3 py-1 border border-white/30 rounded-full text-white/90 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md mb-4 shadow-lg">
                                    {slides[activeSlide].subtitle}
                                </span>
                                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-xl">
                                    {slides[activeSlide].title}
                                </h3>
                                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl">
                                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                                        {slides[activeSlide].description}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};
