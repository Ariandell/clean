import React from 'react';
import { motion } from 'framer-motion';
import { AuroraHero } from './AuroraHero';
import { Header } from './Header';
import { ServicesStack } from './ServicesStack';
import { HorizontalGallery } from './HorizontalGallery';
import { BeforeAfter } from './BeforeAfter';
import { ReviewsMarquee } from './ReviewsMarquee';
import { Footer } from './Footer';
import { ProcessSection } from './sections/ProcessSection';
import { FAQSection } from './sections/FAQSection';
import { AuroraBackground } from './ui/AuroraBackground';

export const MainLayout = ({ heroActive, onOpenBooking }) => {
    const [isStoriesVisible, setIsStoriesVisible] = React.useState(false);

    return (
        <>
            <div className="fixed inset-0 z-[-1]">
                <AuroraBackground />
            </div>
            <Header onOpenBooking={onOpenBooking} minimalMode={isStoriesVisible} />

            <main>
                <div id="hero">
                    <AuroraHero isActive={heroActive} onOpenBooking={onOpenBooking} />
                </div>
                <ServicesStack />
                <ProcessSection />
                <HorizontalGallery onVisibilityChange={setIsStoriesVisible} />
                <BeforeAfter />
                <ReviewsMarquee />
                <FAQSection />
            </main>
            <Footer />
        </>
    );
};
