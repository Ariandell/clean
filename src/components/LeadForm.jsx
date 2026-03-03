import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader2, Phone, User, Home, Ruler } from 'lucide-react';
import { api } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';


export const LeadForm = ({ isOpen, onClose, initialService = '', initialPrice = '', serviceType = 'apartment', priceType = 'sqm' }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState('form');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: 50,
    });
    const [estimatedPrice, setEstimatedPrice] = useState(initialPrice);


    useEffect(() => {
        if (priceType === 'sqm' && initialPrice) {
            // Extract base price number if possible, or use logic passed from parent
            // Here we assume initialPrice might be a string like "50" (per sqm)
            const pricePerSqm = parseInt(initialPrice.replace(/\D/g, '')) || 50;
            setEstimatedPrice((pricePerSqm * formData.area).toLocaleString() + ' ₴');
        } else {
            setEstimatedPrice(initialPrice);
        }
    }, [formData.area, initialPrice, priceType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.submitLead({
                ...formData,
                service_title: initialService, // Keep initialService for API if it's the raw service name
                service_category: serviceType,
                estimated_price: estimatedPrice
            });

            // Track Conversion Events
            if (typeof window !== 'undefined') {
                const numericPrice = estimatedPrice ? parseFloat(estimatedPrice.toString().replace(/\D/g, '')) || 0 : 0;

                // Google Event
                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: 'generate_lead',
                        value: numericPrice,
                        currency: 'UAH',
                        service_category: serviceType
                    });
                }

                // Meta/Facebook Pixel Event
                if (window.fbq) {
                    window.fbq('track', 'Lead', {
                        value: numericPrice,
                        currency: 'UAH',
                        content_name: initialService || 'Cleaning Service',
                        content_category: serviceType
                    });
                }
            }

            setStep('success');
        } catch (error) {
            console.error('Lead submission failed:', error);
            alert(t('leadForm.errorMsg'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('form');
        setFormData({ name: '', phone: '', area: 50 });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />


                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden"
                    >

                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-[80px] pointer-events-none" />


                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-20 hover:bg-white/10 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 relative z-10">
                            {step === 'form' ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-black text-white mb-2 drop-shadow-md">
                                            {initialService || t('leadForm.quickApplication')}
                                        </h2>
                                        <p className="text-white/70 text-sm font-medium">
                                            {t('leadForm.subtitle')}
                                        </p>
                                    </div>


                                    {priceType === 'sqm' && (
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="text-xs text-white/50 uppercase font-bold tracking-wider mb-1">{t('leadForm.estimatedPrice')}</div>
                                            <div className="text-3xl font-black text-white drop-shadow-lg">{estimatedPrice}</div>
                                        </div>
                                    )}


                                    {priceType === 'sqm' && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-bold text-white/80">
                                                <span className="flex items-center gap-2"><Home size={14} /> {t('leadForm.areaLabel')}</span>
                                                <span>{formData.area} м²</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="20"
                                                max="300"
                                                step="5"
                                                value={formData.area}
                                                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all"
                                            />
                                            <div className="flex justify-between text-[10px] text-white/30 font-medium uppercase tracking-wider">
                                                <span>20 м²</span>
                                                <span>300 м²</span>
                                            </div>
                                        </div>
                                    )}


                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                                            <input
                                                type="text"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-black/40 transition-all font-medium"
                                                placeholder={t('leadForm.namePlaceholder')}
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                                            <input
                                                required
                                                type="tel"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-black/40 transition-all font-medium"
                                                placeholder="+380 XX XXX XX XX"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>


                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                        <span>{priceType === 'sqm' ? t('leadForm.submitSqm') : t('leadForm.submitFixed')}</span>
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        type="spring"
                                        className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                                    >
                                        <CheckCircle className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h2 className="text-3xl font-black text-white mb-2">{t('leadForm.successTitle')}</h2>
                                    <p className="text-white/70 mb-8 font-medium">
                                        {t('leadForm.successText')}
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/10"
                                    >
                                        {t('leadForm.successBtn')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
