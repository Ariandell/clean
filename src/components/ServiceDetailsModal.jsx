import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ServiceDetailsModal = ({ isOpen, onClose, service, onBook }) => {
    const { t } = useLanguage();

    if (!service) return null;

    const gradient = service.gradient || 'from-blue-500 to-purple-600';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header Image/Gradient equivalent */}
                        <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                            {/* Header */}
                            <div className="pr-8 mb-6">
                                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-2">
                                    {service.title}
                                </h3>
                                {service.price_type === 'sqm' && (
                                    <span className="inline-block bg-white/5 text-white/70 text-xs uppercase font-bold px-3 py-1 rounded-full border border-white/10">
                                        {t('services.perSqm', 'за м²')}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-white/60 text-base leading-relaxed mb-8">
                                {service.description}
                            </p>

                            {/* Price */}
                            <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-sm text-white/40 mb-1">{t('calculator.estimateLabel', 'Орієнтовна вартість')}</span>
                                <span className="text-3xl font-black text-white tracking-tight">
                                    {service.price_label || service.price}
                                </span>
                            </div>

                            {/* Features */}
                            {service.features && service.features.length > 0 && (
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                        {t('services.includesLabel', 'Що входить:')}
                                    </h4>
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className={`mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-sm text-white/80 leading-relaxed font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-6 sm:p-8 bg-white/5 border-t border-white/5">
                            <button
                                onClick={() => {
                                    onClose();
                                    onBook(service);
                                }}
                                className="group w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {t('services.orderBtn', 'Замовити')}
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
