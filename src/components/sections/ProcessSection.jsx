import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

import { useLanguage } from '../../context/LanguageContext';

const PROCESS_ASSETS = [
    {
        image: "/images/about/hand in glow.png",
        color: "from-cyan-500/20 to-blue-500/20"
    },
    {
        image: "/images/about/cleaning products.png",
        color: "from-blue-500/20 to-indigo-500/20"
    },
    {
        image: "/images/about/floor.png",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        image: "/images/about/hand in glow2.png",
        color: "from-emerald-500/20 to-teal-500/20"
    }
];

const StepText = ({ step, index, setActiveStep }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) setActiveStep(index);
    }, [isInView, index, setActiveStep]);

    return (
        <div ref={ref} className="min-h-[80vh] flex flex-col justify-center py-20 pb-[20vh] last:pb-0">
            <span className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${step.color} opacity-20 block mb-6 -ml-2 select-none transition-all duration-500 ${isInView ? 'opacity-40 scale-110' : ''}`}>
                0{index + 1}
            </span>
            <h3 className={`text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight transition-all duration-500 ${isInView ? 'text-white' : 'text-white/20'}`}>
                {step.title}
            </h3>
            <p className={`text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-sm transition-all duration-500 ${isInView ? 'opacity-100' : 'opacity-20'}`}>
                {step.desc}
            </p>
        </div>
    );
};

export const ProcessSection = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { t } = useLanguage();

    const stepsData = t('process.steps', { returnObjects: true });
    // Ensure we have an array, fallback to valid structure if translation fails or returns string
    const safeStepsHeader = Array.isArray(stepsData) ? stepsData : [];

    const steps = PROCESS_ASSETS.map((asset, i) => ({
        ...asset,
        ...(safeStepsHeader[i] || { title: '', desc: '' })
    }));

    return (
        <section className="relative z-10 bg-black pb-32">

            <div className="pt-32 px-6 max-w-7xl mx-auto text-center bg-black relative z-20 mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">{t('process.badge')}</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter">
                    {t('process.title')}
                </h2>
            </div>

            <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row">

                <div className="hidden lg:block w-full lg:w-1/2 px-6 relative z-10">
                    {steps.map((step, i) => (
                        <StepText key={i} step={step} index={i} setActiveStep={setActiveStep} />
                    ))}
                </div>


                <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen items-center justify-center pl-10">
                    <div className="relative w-full max-w-[500px] aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-[0_8px_80px_-20px_rgba(255,255,255,0.06)]">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 1.08 }}
                                animate={{
                                    opacity: activeStep === i ? 1 : 0,
                                    scale: activeStep === i ? 1 : 1.08
                                }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-25 mix-blend-overlay`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                            </motion.div>
                        ))}
                        <div className="absolute inset-0 z-10 rounded-[2.5rem] ring-1 ring-inset ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] pointer-events-none" />
                    </div>
                </div>
            </div>


            <div className="lg:hidden px-6 pb-20">
                {steps.map((step, i) => (
                    <div key={i} className="mb-24 last:mb-0">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-lg relative bg-[#0a0a0a]">
                            <img src={step.image} alt={step.title} loading="lazy" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${step.color} opacity-40 block mb-4`}>
                            0{i + 1}
                        </span>
                        <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">{step.title}</h3>
                        <p className="text-lg text-white/60 leading-relaxed font-light">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
