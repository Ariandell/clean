import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Building2, Briefcase, Sparkles, ArrowRight, Phone, Ruler } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BookingWizard = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        size: '',
        service: '',
        phone: '',
        name: ''
    });

    const updateData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const skipToContact = () => setStep(4);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending to Telegram:", formData);
        alert(t('booking.step4.successAlert'));
        onClose();

        setTimeout(() => setStep(1), 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />


            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >

                <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white">{t('booking.title')}</h3>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1 w-8 rounded-full transition-colors ${step >= i ? 'bg-blue-600' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-white/50 hover:text-white" />
                    </button>
                </div>


                <div className="p-8 flex-1 overflow-y-auto flex flex-col">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepType key="step1" onSelect={(val) => { updateData('type', val); nextStep(); }} onSkip={skipToContact} t={t} />
                        )}
                        {step === 2 && (
                            <StepSize key="step2" onNext={(val) => { updateData('size', val); nextStep(); }} onBack={prevStep} t={t} />
                        )}
                        {step === 3 && (
                            <StepService key="step3" onSelect={(val) => { updateData('service', val); nextStep(); }} onBack={prevStep} t={t} />
                        )}
                        {step === 4 && (
                            <StepContact key="step4" data={formData} onChange={updateData} onSubmit={handleSubmit} onBack={prevStep} t={t} />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const StepType = ({ onSelect, onSkip, t }) => {
    const options = [
        { id: 'apartment', label: t('booking.step1.apartment'), icon: Building2 },
        { id: 'house', label: t('booking.step1.house'), icon: Home },
        { id: 'office', label: t('booking.step1.office'), icon: Briefcase },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h4 className="text-2xl font-bold text-white mb-2">{t('booking.step1.title')}</h4>
            <p className="text-white/50 mb-6 text-sm">{t('booking.step1.subtitle')}</p>

            <div className="grid gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className="flex items-center gap-4 p-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-blue-500/50 transition-all group text-left"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <opt.icon className="text-white/70 group-hover:text-blue-400" />
                        </div>
                        <span className="text-lg text-white font-medium">{opt.label}</span>
                        <ArrowRight className="ml-auto text-white/20 group-hover:text-white/50" />
                    </button>
                ))}
            </div>


            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-sm mb-3">{t('booking.step1.skipTitle')}</p>
                <button
                    onClick={onSkip}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors border border-white/5 hover:border-white/20"
                >
                    <Phone className="w-4 h-4" />
                    <span>{t('booking.step1.skipBtn')}</span>
                </button>
            </div>
        </motion.div>
    );
};

const StepSize = ({ onNext, onBack, t }) => {
    const [size, setSize] = useState('');

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h4 className="text-2xl font-bold text-white mb-2">{t('booking.step2.title')}</h4>
            <p className="text-white/50 mb-6 text-sm">{t('booking.step2.subtitle')}</p>

            <div className="mb-8">
                <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                        type="number"
                        placeholder={t('booking.step2.placeholder')}
                        autoFocus
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-2xl placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">м²</span>
                </div>
            </div>

            <button
                onClick={() => onNext(size)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
                {t('booking.step2.next')}
            </button>

            <button onClick={onBack} className="mt-4 text-white/50 hover:text-white text-sm py-2 text-center w-full">
                {t('booking.step2.back')}
            </button>
        </motion.div>
    );
};

const StepService = ({ onSelect, onBack, t }) => {
    const optionsData = t('booking.step3.options', { returnObjects: true });
    // Safe access
    const optionsList = Array.isArray(optionsData) ? optionsData : [];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h4 className="text-2xl font-bold text-white mb-6">{t('booking.step3.title')}</h4>
            <div className="grid gap-3 mb-auto">
                {optionsList.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className="p-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-blue-500/50 transition-all text-left group"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-lg text-white font-medium group-hover:text-blue-400 transition-colors">{opt.label}</span>
                            <Sparkles className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-white/50">{opt.desc}</p>
                    </button>
                ))}
            </div>
            <button onClick={onBack} className="mt-6 text-white/50 hover:text-white text-sm py-2">
                {t('booking.step3.back')}
            </button>
        </motion.div>
    );
};

const StepContact = ({ data, onChange, onSubmit, onBack, t }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h4 className="text-2xl font-bold text-white mb-2">{t('booking.step4.title')}</h4>
            <p className="text-white/50 mb-6">{t('booking.step4.subtitle')}</p>

            <form onSubmit={onSubmit} className="space-y-4 mb-auto">
                <div>
                    <input
                        type="text"
                        placeholder={t('booking.step4.namePlaceholder')}
                        value={data.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        placeholder={t('booking.step4.phonePlaceholder')}
                        required
                        autoFocus
                        value={data.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] mt-4"
                >
                    {t('booking.step4.submit')}
                </button>
            </form>

            <button onClick={onBack} className="mt-4 text-white/50 hover:text-white text-sm py-2 text-center w-full">
                {t('booking.step4.back')}
            </button>
        </motion.div>
    );
};
