import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, Check } from 'lucide-react';
import { LeadForm } from './LeadForm';

export const PriceCalculator = () => {
    const [serviceType, setServiceType] = useState('apartment');
    const [area, setArea] = useState(50);
    const [price, setPrice] = useState(0);
    const [showLeadForm, setShowLeadForm] = useState(false);


    const prices = {
        apartment: { base: 2500, perSqm: 40 },
        house: { base: 3500, perSqm: 50 },
        office: { base: 2000, perSqm: 35 },
        renovation: { base: 4000, perSqm: 60 },
        drycleaning: { base: 1500, perSqm: 0 }
    };

    const services = [
        { id: 'apartment', label: 'Квартира', icon: '🏢' },
        { id: 'house', label: 'Будинок', icon: '🏡' },
        { id: 'office', label: 'Офіс', icon: '💼' },
        { id: 'renovation', label: 'Після ремонту', icon: '🔨' }
    ];

    useEffect(() => {
        const selected = prices[serviceType];
        if (selected) {
            const calculated = selected.base + (area * selected.perSqm);
            setPrice(calculated);
        }
    }, [serviceType, area]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">

            <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Калькулятор</h2>
                </div>


                <div className="mb-6">
                    <label className="block text-white/60 text-sm font-medium mb-3">Тип приміщення / Послуга</label>
                    <div className="grid grid-cols-2 gap-3">
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setServiceType(s.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${serviceType === s.id
                                    ? 'bg-blue-600/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-xl">{s.icon}</span>
                                <span className="font-medium text-sm">{s.label}</span>
                                {serviceType === s.id && <Check className="w-4 h-4 ml-auto text-blue-400" />}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <label className="text-white/60 text-sm font-medium">Площа</label>
                        <span className="text-white font-bold">{area} м²</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="500"
                        step="5"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-white/30 mt-2">
                        <span>20 м²</span>
                        <span>500 м²</span>
                    </div>
                </div>
            </div>


            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 md:w-80 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                <div>
                    <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Орієнтовна вартість</span>
                    <div className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight">
                        {price.toLocaleString()} ₴
                    </div>
                    <p className="text-white/60 text-sm mt-3 leading-relaxed">
                        Ціна включає базове прибирання, миючі засоби та інвентар.
                    </p>
                </div>

                <button
                    onClick={() => setShowLeadForm(true)}
                    className="mt-8 w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    Замовити
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <LeadForm
                isOpen={showLeadForm}
                onClose={() => setShowLeadForm(false)}
                initialService={services.find(s => s.id === serviceType)?.label}
                initialPrice={`${price} ₴`}
            />
        </div>
    );
};
