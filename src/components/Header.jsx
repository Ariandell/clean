import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../config';
import { useSettings } from '../context/SettingsContext';
import { ContactOverlay } from './ContactOverlay';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export const Header = ({ onOpenBooking, minimalMode }) => {
    const [menuState, setMenuState] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const { settings } = useSettings();
    const { t } = useLanguage();

    const socialLinks = [
        { name: 'instagram', url: settings.instagram },
        { name: 'Telegram', url: settings.telegram }
    ].filter(link => link.url);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (menuState || contactOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [menuState, contactOpen]);

    const isHome = location.pathname === '/';

    const getLinkProps = (href) => {
        if (href.startsWith('/')) {
            return { as: Link, to: href };
        }
        if (href.startsWith('#')) {
            return { as: 'a', href: isHome ? href : `/${href}` };
        }
        return { as: 'a', href };
    };

    return (
        <header>
            <AnimatePresence mode="wait">
                {(!minimalMode || menuState) ? (
                    <motion.nav
                        key="full-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'py-3 max-[375px]:py-2' : 'py-5 max-[375px]:py-3'}`}
                    >
                        <div className={`mx-auto max-w-7xl px-4 max-[375px]:px-3 md:px-12 transition-all duration-300`}>
                            <motion.div
                                layoutId="header-container"
                                className={`relative flex items-center justify-between px-4 max-[375px]:px-3 py-2 max-[375px]:py-1.5 rounded-full transition-all duration-300 ${isScrolled
                                    ? 'bg-[#0a0a0a]/60 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 shadow-2xl'
                                    : 'bg-transparent'
                                    }`}
                            >

                                <Link to="/" className="flex items-center space-x-2 z-50 relative group">
                                    <Sparkles className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" strokeWidth={2} />
                                    <span className="text-base max-[375px]:text-sm font-bold tracking-tight uppercase text-white group-hover:tracking-widest transition-all duration-300">
                                        {siteConfig.brand.name}
                                    </span>
                                </Link>


                                <div className="hidden lg:flex items-center gap-8">
                                    <ul className="flex gap-8 text-sm font-medium">
                                        {[
                                            { key: 'home', href: '/' },
                                            { key: 'services', href: '/services' },
                                            { key: 'contacts', href: '#' }
                                        ].map(({ key, href }, index) => {
                                            const name = t(`nav.${key}`);
                                            const isContactLink = key === 'contacts';
                                            if (isContactLink) {
                                                return (
                                                    <li key={key}>
                                                        <button
                                                            onClick={() => setContactOpen(true)}
                                                            className="text-white/70 hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all hover:after:w-full"
                                                        >
                                                            {name}
                                                        </button>
                                                    </li>
                                                );
                                            }
                                            const isServiceLink = key === 'services';
                                            const targetHref = isServiceLink ? '/services' : href;
                                            const { as: Component, ...props } = getLinkProps(targetHref);

                                            return (
                                                <li key={key}>
                                                    <Component
                                                        {...props}
                                                        className="text-white/70 hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all hover:after:w-full"
                                                    >
                                                        {name}
                                                    </Component>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div className="w-px h-4 bg-white/20" />
                                    <div className="flex items-center gap-4">
                                        <LanguageSwitcher />
                                        <button
                                            onClick={onOpenBooking}
                                            className="px-5 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
                                        >
                                            {t('hero.cta')}
                                        </button>
                                    </div>
                                </div>


                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    className="lg:hidden relative z-[110] p-2 -mr-2 text-white hover:text-gray-300 transition-colors"
                                >
                                    <motion.div
                                        animate={menuState ? "open" : "closed"}
                                        className="w-6 h-6 flex flex-col justify-center gap-1.5"
                                    >
                                        <motion.span
                                            variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }}
                                            className="w-full h-0.5 bg-current block origin-center"
                                        />
                                        <motion.span
                                            variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                                            className="w-full h-0.5 bg-current block"
                                        />
                                        <motion.span
                                            variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }}
                                            className="w-full h-0.5 bg-current block origin-center"
                                        />
                                    </motion.div>
                                </button>
                            </motion.div>
                        </div>
                    </motion.nav>
                ) : (
                    <motion.button
                        key="minimal-header"
                        layoutId="header-container"
                        onClick={() => setMenuState(true)}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-6 right-6 z-[100] w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                    >
                        <Menu className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.button>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {menuState && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-8"
                    >


                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                            animate={{ y: "0%", opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 28, stiffness: 250, mass: 1 }}
                            style={{ willChange: 'transform' }}
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={{ top: 0, bottom: 0.2 }}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 150) {
                                    setMenuState(false);
                                }
                            }}
                            className="relative w-full max-w-md max-h-[85dvh] bg-[#1a1a1a]/70 backdrop-blur-3xl backdrop-saturate-150 border-t sm:border border-white/20 sm:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl shadow-black/80 flex flex-col"
                        >


                            <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] ring-1 ring-white/10 ring-inset" />


                            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-900/5 to-transparent rounded-full blur-[60px] pointer-events-none opacity-60" />


                            <div className="w-full h-8 flex items-center justify-center shrink-0 mt-2 cursor-grab active:cursor-grabbing z-20">
                                <div className="w-12 h-1.5 bg-white/20 rounded-full backdrop-blur-md" />
                            </div>

                            <div className="p-6 max-[375px]:p-4 pt-4 max-[375px]:pt-2 flex flex-col h-full relative z-10">

                                <ul className="flex flex-col gap-2 max-[375px]:gap-1 mt-2 max-[375px]:mt-1">
                                    {[
                                        { key: 'home', href: '/' },
                                        { key: 'services', href: '/services' },
                                        { key: 'contacts', href: '#' }
                                    ].map(({ key, href }, index) => {
                                        const name = t(`nav.${key}`);
                                        const isContactLink = key === 'contacts';
                                        const isServiceLink = key === 'services';

                                        const handleMobileClick = () => {
                                            setMenuState(false);
                                            if (isContactLink) {
                                                setTimeout(() => setContactOpen(true), 300);
                                            }
                                        };

                                        const targetHref = isContactLink ? '#' : (isServiceLink ? '/services' : href);
                                        const { as: Component, ...props } = isContactLink
                                            ? { as: 'button' }
                                            : getLinkProps(targetHref);

                                        return (
                                            <motion.li
                                                key={key}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + index * 0.06, type: "spring", stiffness: 200 }}
                                            >
                                                <Component
                                                    {...props}
                                                    onClick={handleMobileClick}
                                                    className="group relative flex items-center justify-between p-4 max-[375px]:p-3 rounded-[1.5rem] max-[375px]:rounded-xl overflow-hidden w-full text-left"
                                                >

                                                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/5 to-white/5 blur-xl" />

                                                    <span className="relative z-10 text-2xl max-[375px]:text-xl font-semibold text-white tracking-tight group-hover:scale-[1.02] transition-transform duration-300">
                                                        {name}
                                                    </span>

                                                    <div className="relative z-10 w-9 max-[375px]:w-8 h-9 max-[375px]:h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14m-7-7 7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Component>
                                            </motion.li>
                                        )
                                    })}
                                </ul>


                                <div className="mt-auto pt-6 max-[375px]:pt-4 flex flex-col gap-6 px-2">
                                    <div className="flex justify-between items-center px-4 py-2 border border-white/10 rounded-2xl bg-white/5">
                                        <span className="text-sm font-medium text-white/40 uppercase tracking-widest">{t('nav.langLabel')}</span>
                                        <LanguageSwitcher />
                                    </div>

                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        onClick={() => {
                                            setMenuState(false);
                                            setTimeout(() => onOpenBooking(), 300);
                                        }}
                                        className="relative w-full py-5 rounded-2xl overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white" />


                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm" />

                                        <span className="relative z-10 text-black text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                            {t('hero.cta')}
                                        </span>
                                    </motion.button>

                                    {socialLinks.length > 0 && (
                                        <div className="flex justify-center gap-8 mt-8 pb-4">
                                            {socialLinks.map(({ name, url }) => (
                                                <a
                                                    key={name}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white/30 hover:text-white text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                >
                                                    {name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <ContactOverlay isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </header>
    );
};
