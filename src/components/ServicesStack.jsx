import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Star, Shield, Clock } from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { LeadForm } from './LeadForm';
import { useLanguage } from '../context/LanguageContext';

import { API_URL } from '../utils/api';

const Card = ({ i, title, description, price, price_label, features = [], gradient, image_url, progress, range, targetScale, onOrder, t }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);


    const priceDisplay = price_label || (price ? `${price} ₴` : t('services.priceAsk'));

    const cardGradient = gradient || "from-blue-500 to-purple-600";

    const cardFeatures = features.length > 0 ? features.slice(0, 3) : t('services.defaultFeatures', { returnObjects: true });


    const BASE_URL = 'http://localhost:5000';
    const imageSrc = image_url ? `${BASE_URL}${image_url}` : null;

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative flex flex-col w-[90vw] max-w-6xl h-[70vh] rounded-[2.5rem] origin-top border border-white/10 shadow-2xl overflow-hidden bg-[#1a1a1a] will-change-transform"
            >

                <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-5`} />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex h-full flex-col md:flex-row relative z-10">

                    <div className="flex-1 flex flex-col justify-between p-8 md:p-12">
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/70 mb-6 backdrop-blur-md">
                                {t('services.serviceLabel')} 0{i + 1}
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[0.9]">{title}</h2>
                            <p className="text-lg text-white/60 leading-relaxed max-w-md break-words line-clamp-3">{description}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="h-px w-full bg-white/10" />
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-white">{priceDisplay}</span>
                            </div>
                            <button
                                onClick={onOrder}
                                className="group w-fit px-8 py-4 bg-white text-black rounded-full font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all flex items-center gap-3"
                            >
                                {t('services.calculateCost')}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>


                    <div className="flex-1 relative overflow-hidden bg-black/20 m-2 md:m-3 rounded-[2rem]">
                        {imageSrc ? (
                            <>
                                <img
                                    src={imageSrc}
                                    alt={title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            </>
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-20`} />
                        )}


                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">{t('services.includesLabel')}</h3>
                            <div className="flex flex-wrap gap-3">
                                {cardFeatures.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cardGradient}`} />
                                        <span className="text-white/90 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const ServicesStack = () => {
    const containerRef = useRef(null);
    const { services } = useServices();
    const { t } = useLanguage();
    const [selectedService, setSelectedService] = useState(null);


    const featuredServices = services.filter(s => s.is_featured);
    const displayServices = featuredServices.length > 0 ? featuredServices : services.slice(0, 3);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={containerRef} id="services" className="relative pt-20">
            <div className="mb-20 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white/80">{t('services.popularBadge')}</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6">
                    {t('services.mainTitlePart1')}
                    <br />
                    {t('services.mainTitlePart2')}
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    {t('services.mainDesc')}
                </p>
            </div>


            <div className="hidden md:block">
                {displayServices.map((service, i) => {
                    const targetScale = 1 - ((displayServices.length - i) * 0.05);
                    return (
                        <Card
                            key={service.id || i}
                            i={i}
                            index={i}
                            card={service}
                            {...service}
                            progress={scrollYProgress}
                            range={[i * .25, 1]}
                            targetScale={targetScale}
                            onOrder={() => setSelectedService(service)}
                            t={t}
                        />
                    )
                })}
            </div>


            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory px-4 pb-12 gap-4 no-scrollbar">
                {displayServices.map((service, i) => {

                    const features = service.features && service.features.length > 0
                        ? service.features.slice(0, 3)
                        : ["Професійне обладнання", "Еко-засоби", "Гарантія якості"];

                    const gradient = service.gradient || "from-blue-500 to-purple-600";

                    return (
                        <div key={service.id || i} className="flex-shrink-0 w-[85vw] snap-center">
                            <div className={`relative h-[60vh] max-[375px]:h-[55vh] rounded-[2rem] max-[375px]:rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#1a1a1a] flex flex-col`}>

                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />


                                <div className="p-5 max-[375px]:p-4 relative z-10 flex-1 flex flex-col">
                                    <span className={`self-start px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] max-[375px]:text-[8px] font-bold uppercase tracking-widest text-white/70 mb-3 max-[375px]:mb-2 backdrop-blur-md`}>
                                        Service 0{i + 1}
                                    </span>
                                    <h2 className="text-2xl max-[375px]:text-xl font-black text-white mb-2 max-[375px]:mb-1 tracking-tight leading-none">{service.title}</h2>
                                    <p className="text-sm max-[375px]:text-xs text-white/60 leading-relaxed line-clamp-2 max-[375px]:line-clamp-2 mb-3 max-[375px]:mb-2 break-words">{service.description}</p>

                                    <div className="mt-auto">
                                        <span className="text-xl max-[375px]:text-lg font-bold text-white block">{service.price_label || service.price}</span>
                                        <button
                                            onClick={() => setSelectedService(service)}
                                            className="w-full mt-3 max-[375px]:mt-2 py-2.5 max-[375px]:py-2 bg-white text-black rounded-xl max-[375px]:rounded-lg font-bold text-sm max-[375px]:text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                        >
                                            Дізнатись вартість
                                        </button>
                                    </div>
                                </div>


                                <div className="relative h-1/4 max-[375px]:h-1/5 bg-white/5 border-t border-white/5 p-3 max-[375px]:p-2 flex flex-col gap-1.5 max-[375px]:gap-1 overflow-hidden">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                            <span className="text-xs text-white/80 font-medium truncate">{feature}</span>
                                        </div>
                                    ))}

                                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} blur-[50px] opacity-40 pointer-events-none`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
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
    )
}
