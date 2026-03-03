import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactOverlay = ({ isOpen, onClose }) => {
    const { settings } = useSettings();
    const { t } = useLanguage();
    const phone = settings.phone || siteConfig.contact.phone;
    const email = settings.email || siteConfig.contact.email;

    const socialLinks = [
        settings.instagram && { name: 'Instagram', url: settings.instagram, icon: ExternalLink },
        settings.telegram && { name: 'Telegram', url: settings.telegram, icon: MessageCircle },
    ].filter(Boolean);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
                    onClick={onClose}
                >

                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />


                    <motion.div
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 40, opacity: 0 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-[#1a1a1e]/80 backdrop-blur-3xl backdrop-saturate-150 border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
                    >

                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />


                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-gradient-to-b from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-[60px] pointer-events-none" />


                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative z-10 p-8 sm:p-10">

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl sm:text-3xl font-semibold text-white">{t('contact.title')}</h2>
                                <p className="mt-2 text-white/50 text-sm">{t('contact.subtitle')}</p>
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="mt-8 space-y-3"
                            >

                                <a
                                    href={`tel:${phone.replace(/\s/g, '')}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:border-cyan-400/20 transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-400/20 transition-colors">
                                        <Phone className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-lg">{phone}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{t('contact.callHint')}</div>
                                    </div>
                                </a>


                                <a
                                    href={`mailto:${email}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:border-white/15 transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                        <Mail className="w-5 h-5 text-white/70" />
                                    </div>
                                    <div>
                                        <div className="text-white/90 font-medium">{email}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{t('contact.emailHint')}</div>
                                    </div>
                                </a>


                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-white/70" />
                                    </div>
                                    <div>
                                        <div className="text-white/90 font-medium">{t('contact.address')}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{t('contact.addressLabel')}</div>
                                    </div>
                                </div>


                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-white/70" />
                                    </div>
                                    <div>
                                        <div className="text-white/90 font-medium">{t('contact.schedule')}</div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-emerald-400/80 text-xs">{t('contact.onlineNow')}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>


                            {socialLinks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.25 }}
                                    className="mt-6 flex gap-3"
                                >
                                    {socialLinks.map(({ name, url, icon: Icon }) => (
                                        <a
                                            key={name}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/60 text-sm font-medium hover:text-white hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300"
                                        >
                                            <Icon className="w-4 h-4" />
                                            {name}
                                        </a>
                                    ))}
                                </motion.div>
                            )}


                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6"
                            >
                                <a
                                    href={`tel:${phone.replace(/\s/g, '')}`}
                                    className="block w-full py-4 bg-white text-black rounded-2xl text-center font-bold text-base hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                >
                                    {t('contact.callNow')}
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
