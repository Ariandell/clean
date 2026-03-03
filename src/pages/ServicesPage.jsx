import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Check, ArrowRight, Briefcase } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { LeadForm } from '../components/LeadForm';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export const ServicesPage = () => {
    const { services } = useServices();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('apartment');
    const [selectedService, setSelectedService] = useState(null);

    const categories = [
        { id: 'apartment', label: t('services.tabs.apartment') },
        { id: 'house', label: t('services.tabs.house') },
        { id: 'office', label: t('services.tabs.office') }
    ];

    const filteredServices = services.filter(s => s.category === activeTab);

    return (
        <div className="bg-black min-h-screen font-sans relative overflow-hidden">
            <AuroraBackground />
            <Header onOpenBooking={() => { }} />

            <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto relative z-10">

                {/* Hero */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                    >
                        <span className="text-sm font-medium text-white/80 uppercase tracking-widest">{t('services.badge')}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter mb-6"
                    >
                        {t('services.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        {t('services.subtitle')}
                    </motion.p>
                </div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center mb-16"
                >
                    <div className="flex justify-center gap-1">
                        {categories.map((cat) => {
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`relative px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white' : 'text-white/30 hover:text-white/50'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-2 right-2 h-px bg-white/60"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Service Cards Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service, index) => {
                                const gradient = service.gradient || 'from-blue-500 to-purple-600';
                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <SpotlightCard className="h-full hover:-translate-y-1 transition-transform duration-300">
                                            <div className="p-7 md:p-8 flex flex-col h-full">

                                                {/* Gradient Accent Bar */}
                                                <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${gradient} mb-6`} />

                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">{service.title}</h3>
                                                    {service.price_type === 'sqm' && (
                                                        <span className="bg-white/5 text-white/50 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-white/10 whitespace-nowrap ml-3 mt-1">
                                                            {t('services.perSqm')}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <p className="text-white/50 text-sm leading-relaxed mb-6 min-h-[40px]">
                                                    {service.description}
                                                </p>

                                                {/* Price */}
                                                <div className="mb-8">
                                                    <span className="text-3xl font-black text-white tracking-tight">
                                                        {service.price_label || service.price}
                                                    </span>
                                                </div>

                                                {/* Features */}
                                                <div className="space-y-3 mb-8 flex-1">
                                                    {service.features.map((feature, i) => (
                                                        <div key={i} className="flex items-start gap-3">
                                                            <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                            <span className="text-sm text-white/70 leading-snug">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* CTA */}
                                                <button
                                                    onClick={() => setSelectedService(service)}
                                                    className="group w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    {t('services.orderBtn')}
                                                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </SpotlightCard>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-24">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Briefcase className="w-7 h-7 text-white/30" />
                                </div>
                                <p className="text-white/40 text-lg font-medium">{t('services.emptyTitle')}</p>
                                <p className="text-white/20 text-sm mt-2">{t('services.emptySubtitle')}</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10">
                <Footer />
            </div>

            <LeadForm
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                initialService={selectedService?.title}
                initialPrice={selectedService?.price_label || selectedService?.price}
                priceType={selectedService?.price_type || 'fixed'}
                serviceType={selectedService?.category}
            />
        </div>
    );
};
