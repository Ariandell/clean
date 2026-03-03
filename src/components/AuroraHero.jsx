import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "../config";
import { useLanguage } from "../context/LanguageContext";


const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 1.5,
        }
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const videoContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 2,
            delay: 1,
        },
    },
};

export const AuroraHero = ({ onOpenBooking }) => {
    const { t } = useLanguage();
    const scrollToServices = () => {
        const servicesSection = document.querySelector('#services');
        servicesSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="overflow-hidden min-h-[calc(var(--vh,1vh)*100)] bg-black">
            <section>
                <div className="relative pt-20 max-[375px]:pt-16 md:pt-36 min-h-[calc(var(--vh,1vh)*100)]">

                    <div className="absolute inset-0 z-0">
                        <div className="h-full w-full overflow-hidden rounded-3xl border border-white/5 relative">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                fetchPriority="high"
                                preload="auto"
                                className="w-full h-full object-cover opacity-60"
                                style={{ minHeight: 'calc(var(--vh, 1vh) * 100)', willChange: 'transform' }}
                            >


                                <source src="/video/backgr.mp4" type="video/mp4" />
                            </video>

                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    </div>


                    <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-center relative z-10">
                        <div className="text-center w-full">

                            <motion.h1
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-32 max-[375px]:mt-24 text-balance text-4xl max-[375px]:text-3xl md:text-7xl lg:text-[5.25rem] font-semibold text-white"
                                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
                            >
                                {t('hero.words').map((word, i) => (
                                    <motion.span
                                        key={i}
                                        variants={fadeIn}
                                        className="inline-block mr-4"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.h1>


                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="mx-auto mt-4 max-[375px]:mt-3 max-w-2xl text-balance text-base max-[375px]:text-sm md:text-xl text-white"
                                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
                            >
                                {t('hero.subtitle')}
                            </motion.p>


                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-8 max-[375px]:mt-6 flex flex-col items-center justify-center gap-3 max-[375px]:gap-2 md:flex-row"
                            >
                                <motion.div
                                    variants={fadeIn}
                                    className="bg-white/20 rounded-[calc(1rem+0.125rem)] border border-white/40 p-0.5"
                                >
                                    <button
                                        onClick={() => onOpenBooking()}
                                        className="px-5 max-[375px]:px-4 py-3 max-[375px]:py-2.5 bg-white text-black rounded-xl text-base max-[375px]:text-sm font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        <span>{t('hero.cta')}</span>
                                    </button>
                                </motion.div>
                                <motion.button
                                    variants={fadeIn}
                                    onClick={scrollToServices}
                                    className="px-5 max-[375px]:px-4 py-3 max-[375px]:py-2.5 bg-black/30 text-white rounded-xl text-base max-[375px]:text-sm font-semibold hover:bg-black/50 transition-all border border-white/40 backdrop-blur-sm"
                                >
                                    <span>{t('hero.servicesBtn')}</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 cursor-pointer z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        onClick={scrollToServices}
                    >
                        <span className="text-white text-xs font-medium tracking-wider uppercase">
                            {t('hero.scrollDown')}
                        </span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-white"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 10l5 5 5-5" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
