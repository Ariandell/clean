import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-black min-h-screen relative overflow-hidden">
            <AuroraBackground />
            <Header />

            <main className="relative z-[2] pt-32 pb-16 min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6">{t('about.title')}</h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto px-6">
                        {t('about.text')}
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};
