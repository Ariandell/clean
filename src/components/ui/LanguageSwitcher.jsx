import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/5 relative">
            {['UA', 'EN'].map((l) => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`relative px-3 py-1.5 text-xs font-bold rounded-full transition-colors duration-300 z-10 ${lang === l ? 'text-black' : 'text-white/60 hover:text-white'}`}
                >
                    {lang === l && (
                        <motion.div
                            layoutId="active-lang"
                            className="absolute inset-0 bg-white rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <span className="relative z-10">{l}</span>
                </button>
            ))}
        </div>
    );
};
