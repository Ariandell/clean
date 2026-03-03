import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';



const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-8 flex items-center justify-between text-left group"
            >
                <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {item.q}
                </span>
                <span className={`flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 transition-all duration-300 ${isOpen ? 'bg-white text-black rotate-90 scale-110' : 'bg-transparent text-white group-hover:border-white/40'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-lg text-white/50 leading-relaxed max-w-3xl font-light">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

import { useLanguage } from '../../context/LanguageContext';

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const { t } = useLanguage();

    const faqData = t('faq.items', { returnObjects: true });
    // Safe access
    const FAQ = Array.isArray(faqData) ? faqData : [];

    return (
        <section className="py-24 md:py-32 relative z-10 bg-black">
            <div className="mx-auto max-w-4xl px-6 relative z-10">
                <ScrollReveal>
                    <div className="mb-20 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <span className="text-sm font-medium text-white/80 uppercase tracking-widest">{t('faq.badge')}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                            {t('faq.title')} <br /> {t('faq.titleBreak')}
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="space-y-0">
                    {FAQ.map((item, i) => (
                        <ScrollReveal key={i}>
                            <FAQItem
                                item={item}
                                isOpen={openIndex === i}
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};
