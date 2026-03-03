import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Send, Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '../config';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
    const { settings } = useSettings();
    const { t } = useLanguage();

    const socialLinks = [
        { Icon: Instagram, url: settings.instagram, name: 'Instagram' },
        { Icon: Facebook, url: settings.facebook, name: 'Facebook' },
        { Icon: Send, url: settings.telegram, name: 'Telegram' }
    ].filter(link => link.url);

    return (
        <footer className="bg-black/20 backdrop-blur-sm pt-20 pb-10 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    <div className="md:col-span-4 space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold text-white tracking-tighter uppercase"
                        >
                            Uberem
                        </motion.h2>
                        <p className="text-white/40 text-sm md:text-base max-w-xs font-light leading-relaxed">
                            {t('footer.description')} <br />
                            {t('footer.descriptionLine2')}
                        </p>
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map(({ Icon, url, name }) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
                        <div className="space-y-4">
                            <h4 className="text-white font-medium uppercase tracking-widest text-xs opacity-50">{t('footer.servicesTitle')}</h4>
                            <ul className="space-y-2">
                                {(t('footer.servicesItems', { returnObjects: true }) || []).map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-medium uppercase tracking-widest text-xs opacity-50">{t('footer.companyTitle')}</h4>
                            <ul className="space-y-2">
                                {(t('footer.companyItems', { returnObjects: true }) || []).map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-4 mt-4 md:mt-0">
                            <h4 className="text-white font-medium uppercase tracking-widest text-xs opacity-50">{t('footer.contactsTitle')}</h4>
                            <div className="space-y-3">
                                <a href={`tel:${(settings.phone || siteConfig.contact.phone).replace(/\s/g, '')}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                                    <span className="text-sm font-medium">{settings.phone || siteConfig.contact.phone}</span>
                                </a>
                                <a href={`mailto:${settings.email || siteConfig.contact.email}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                                    <span className="text-sm font-light underline decoration-white/20 underline-offset-4">{settings.email || siteConfig.contact.email}</span>
                                </a>
                                <div className="text-white/40 text-sm font-light">
                                    {settings.address || t('footer.address')} <br />
                                    {settings.hours || '09:00 - 21:00'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/20 text-xs font-light">
                        {t('footer.copyright')}
                    </p>
                    <div className="flex gap-6 text-xs font-light">
                        <a href="#" className="text-white/20 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-white/20 hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
