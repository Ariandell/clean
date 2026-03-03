import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, Send } from 'lucide-react';

export const QuickContact = () => {
    const [isOpen, setIsOpen] = useState(false);

    const contacts = [
        {
            icon: Phone,
            label: 'Зателефонувати',
            href: 'tel:+380991234567',
            color: 'bg-green-500',
            delay: 0.1
        },
        {
            icon: MessageCircle,
            label: 'Telegram',
            href: 'https://t.me/your_manager',
            color: 'bg-blue-500',
            delay: 0.05
        },

    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {contacts.map((contact, index) => (
                            <motion.a
                                key={contact.label}
                                href={contact.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                transition={{ delay: contact.delay, type: 'spring' }}
                                className={`flex items-center gap-3 pr-4 pl-3 py-2 rounded-full shadow-lg backdrop-blur-md border border-white/10 text-white font-medium ${contact.color}/80 hover:${contact.color} transition-colors`}
                            >
                                <contact.icon className="w-5 h-5" />
                                <span className="text-sm">{contact.label}</span>
                            </motion.a>
                        ))}
                    </>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300 ${isOpen ? 'bg-red-500/80 rotate-45' : 'bg-blue-600/80 hover:scale-105'}`}
            >
                {isOpen ? (
                    <PlusIcon className="w-8 h-8 text-white rotate-45" />
                ) : (
                    <MessageCircle className="w-8 h-8 text-white" />
                )}
            </button>
        </div>
    );
};


const PlusIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
