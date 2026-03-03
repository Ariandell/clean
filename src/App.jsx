import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Preloader } from './components/Preloader';
import { OfflineNotice } from './ui/OfflineNotice';
import { SmoothScroll } from './components/SmoothScroll';
import { MainLayout } from './components/MainLayout';
import { LeadForm } from './components/LeadForm';
import { AnimatePresence, motion } from 'framer-motion';
import { ServiceProvider } from './context/ServiceContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AiChat } from './components/AiChat';
import { ServiceDetailsModal } from './components/ServiceDetailsModal';
import { useMobileViewport } from './hooks/useMobileViewport';

function AppContent() {
    useMobileViewport();

    const [phase, setPhase] = useState(() => {
        return sessionStorage.getItem('preloaderShown') ? 'content' : 'loading';
    });

    const [heroActive, setHeroActive] = useState(() => {
        return !!sessionStorage.getItem('preloaderShown');
    });
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [detailsModalService, setDetailsModalService] = useState(null);
    const location = useLocation();


    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);


    useEffect(() => {
        if (isAdminRoute) {
            setPhase('content');
            setHeroActive(true);
        }
    }, [isAdminRoute]);


    useEffect(() => {
        const updateScrollLock = (isLocked) => {
            if (isLocked) {
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
                document.documentElement.style.overflow = 'unset';
            }
        };
        updateScrollLock(phase === 'loading' && !isAdminRoute);
        return () => updateScrollLock(false);
    }, [phase, isAdminRoute]);

    const handlePreloaderComplete = () => {
        setPhase('content');
        sessionStorage.setItem('preloaderShown', 'true');
        setTimeout(() => {
            setHeroActive(true);
        }, 1200);
    };

    const { isTransitioning } = useLanguage();

    return (
        <SmoothScroll>
            <div className="bg-[#0a0a0a] min-h-[calc(var(--vh,1vh)*100)] relative font-sans">
                <OfflineNotice />

                {!isAdminRoute && (
                    <AiChat onOpenDetails={(service) => setDetailsModalService(service)} />
                )}

                <LeadForm
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    initialService={selectedService?.title}
                    priceType={selectedService?.price_type || 'fixed'}
                    initialPrice={selectedService?.price_label || selectedService?.price}
                />

                <ServiceDetailsModal
                    isOpen={!!detailsModalService}
                    onClose={() => setDetailsModalService(null)}
                    service={detailsModalService}
                    onBook={(service) => {
                        setSelectedService(service);
                        setIsBookingOpen(true);
                    }}
                />

                {!isAdminRoute && (
                    <AnimatePresence mode="wait">
                        {phase === 'loading' && (
                            <Preloader key="intro" onComplete={handlePreloaderComplete} />
                        )}
                    </AnimatePresence>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: (phase === 'content' && !isTransitioning) ? 1 : 0 }}
                    transition={{ duration: isTransitioning ? 0.3 : 1.5, ease: "easeOut" }}
                    className={`relative z-10 w-full ${phase === 'content' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <Routes>

                        <Route path="/" element={<MainLayout heroActive={heroActive} onOpenBooking={() => setIsBookingOpen(true)} />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/about" element={<AboutPage />} />


                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />


                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </motion.div>
            </div>
        </SmoothScroll>
    );
}

function App() {
    return (
        <LanguageProvider>
            <ServiceProvider>
                <SettingsProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <AppContent />
                        </BrowserRouter>
                    </AuthProvider>
                </SettingsProvider>
            </ServiceProvider>
        </LanguageProvider>
    );
}

export default App;

