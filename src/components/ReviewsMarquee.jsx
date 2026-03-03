import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const ReviewCard = ({ review }) => (
    <div className="w-full h-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors flex flex-col justify-between">

        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex gap-0.5">
                    {/* Ensure rating is a number, default to 5 if missing */}
                    {[...Array(Number(review.rating) || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    ))}
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-white/40 text-base sm:text-lg">"</span>
                </div>
            </div>

            <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-4 sm:mb-6">
                {review.text}
            </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 pt-4 sm:pt-6 border-t border-white/5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                {review.name.charAt(0)}
            </div>
            <div>
                <div className="flex items-center gap-1.5">
                    <h4 className="text-white font-bold text-sm sm:text-base">{review.name}</h4>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                </div>
                <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider font-medium block">{review.role}</span>
            </div>
        </div>
    </div>
);

export const ReviewsMarquee = () => {
    const { t } = useLanguage();
    const reviews = t('reviews.items', { returnObjects: true }) || [];
    return (
        <section className="py-24 md:py-32 bg-black relative z-10">


            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 mb-12 md:mb-20 px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 md:mb-6"
                >
                    {t('reviews.title')}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 text-base md:text-lg max-w-2xl mx-auto"
                >
                    {t('reviews.subtitle')}
                </motion.p>
            </div>


            <div className="hidden md:block relative w-full overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                <div className="flex mb-8 overflow-hidden">
                    <motion.div
                        className="flex flex-shrink-0"
                        animate={{ x: "-100%" }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    >
                        {reviews.map((review, i) => (
                            <div key={`r1-${i}`} className="w-[400px] mx-4">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="flex flex-shrink-0"
                        animate={{ x: "-100%" }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    >
                        {reviews.map((review, i) => (
                            <div key={`r1-dup-${i}`} className="w-[400px] mx-4">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex flex-shrink-0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        {reviews.slice().reverse().map((review, i) => (
                            <div key={`r2-${i}`} className="w-[400px] mx-4">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="flex flex-shrink-0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        {reviews.slice().reverse().map((review, i) => (
                            <div key={`r2-dup-${i}`} className="w-[400px] mx-4">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>


            <div className="md:hidden relative w-full">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 no-scrollbar pb-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="flex-shrink-0 w-[85vw] snap-center">
                            <ReviewCard review={review} />
                        </div>
                    ))}

                    <div className="w-2 flex-shrink-0" />
                </div>
            </div>

        </section>
    );
};
