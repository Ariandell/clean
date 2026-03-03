import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Bot, ArrowDown, ArrowRight } from 'lucide-react';
import { sendChat } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { useServices } from '../context/ServiceContext';

const ServiceSuggestionCard = ({ serviceName, onOpenDetails, t }) => {
    const { services } = useServices();

    const service = services.find(s =>
        s.title.toLowerCase() === serviceName.toLowerCase() ||
        s.title.toLowerCase().includes(serviceName.toLowerCase()) ||
        serviceName.toLowerCase().includes(s.title.toLowerCase())
    );

    if (!service) return null;

    const gradient = service.gradient || 'from-green-400 to-emerald-600';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="ml-9 mr-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg"
        >
            <div className={`h-[2px] w-full bg-gradient-to-r ${gradient}`} />

            <div className="px-3.5 py-3">
                <div className="flex justify-between items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold text-[13px] leading-tight truncate">{service.title}</h4>
                    <span className="text-emerald-400 text-[10px] font-bold whitespace-nowrap">
                        {service.price_label || service.price}
                    </span>
                </div>

                {service.description && (
                    <p className="text-white/40 text-[11px] mb-2.5 line-clamp-1 leading-snug">
                        {service.description}
                    </p>
                )}

                <button
                    onClick={() => onOpenDetails(service)}
                    className="w-full flex items-center justify-center gap-1.5 bg-white/10 border border-white/15 text-white text-[12px] font-medium py-2 rounded-lg hover:bg-white/15 transition-all duration-200"
                >
                    {t('chat.viewDetailsBtn', "Переглянути детальніше")}
                    <ArrowRight className="w-3 h-3 text-white/50" />
                </button>
            </div>
        </motion.div>
    );
};

const TypingIndicator = () => (
    <div className="flex items-end gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3.5 h-3.5 text-white/60" />
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    </div>
);

const MessageBubble = ({ message, isUser }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-end gap-2.5 mb-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
        {!isUser && (
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white/60" />
            </div>
        )}
        <div
            className={`max-w-[80%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${isUser
                ? 'bg-white text-black rounded-2xl rounded-br-sm font-medium'
                : 'bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-2xl rounded-bl-sm'
                }`}
        >
            {message}
        </div>
    </motion.div>
);

const ManagerButton = ({ phone, label }) => (
    <motion.a
        href={`tel:${phone}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mx-auto mt-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white/80 transition-all w-fit"
    >
        <Phone className="w-3.5 h-3.5" />
        {label}
    </motion.a>
);

const QuickActions = ({ onSelect, t }) => {
    const actionsData = t('chat.quickActions', { returnObjects: true });
    const actions = Array.isArray(actionsData) ? actionsData : [];

    return (
        <div className="flex flex-wrap gap-2.5 mb-5 px-2">
            {actions.map((action) => (
                <button
                    key={action}
                    onClick={() => onSelect(action)}
                    className="px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white/70 text-[13px] font-medium hover:bg-white/[0.12] hover:text-white hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                >
                    {action}
                </button>
            ))}
        </div>
    );
};

const useDetectService = () => {
    const { services } = useServices();

    return useCallback((text) => {
        if (!text || !services.length) return null;

        const tagMatch = text.match(/\[SERVICE:\s*(.+?)\]/);
        if (tagMatch) return tagMatch[1].trim();

        const lowerText = text.toLowerCase();
        let bestMatch = null;
        let bestLen = 0;

        for (const s of services) {
            const title = s.title.toLowerCase();
            if (lowerText.includes(title) && title.length > bestLen) {
                bestMatch = s.title;
                bestLen = title.length;
            }
        }

        return bestMatch;
    }, [services]);
};

export const AiChat = ({ onOpenDetails }) => {
    const { t, lang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const detectService = useDetectService();

    let phone = '+380991234567';
    try {
        const settings = useSettings();
        if (settings?.settings?.phone) phone = settings.settings.phone;
    } catch (e) { }

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        setShowScrollBtn(!isNearBottom);
    };

    const handleSend = async (text) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = [...messages, userMessage].map(m => ({ role: m.role, text: m.text }));
            // Pass the current language to the backend
            const data = await sendChat(messageText, history.slice(0, -1), lang);

            const aiMessage = { role: 'model', text: data.reply };
            setMessages(prev => [...prev, aiMessage]);

            const mentionsManager = data.reply.includes('менеджер') ||
                data.reply.includes('зателефон') ||
                data.reply.includes("зв'яз") ||
                data.reply.toLowerCase().includes('manager') ||
                data.reply.toLowerCase().includes('call');

            if (mentionsManager) {
                setMessages(prev => [...prev, { role: 'action', type: 'manager' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'model',
                text: t('chat.errorMsg')
            }, { role: 'action', type: 'manager' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[70vh] md:h-[550px] max-h-[600px] z-[999] flex flex-col rounded-[1.75rem] overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
                        style={{ background: 'rgba(8, 8, 12, 0.95)', backdropFilter: 'blur(40px) saturate(1.5)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white/70" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#08080c]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm tracking-tight">{t('chat.headerTitle')}</h3>
                                    <p className="text-white/30 text-[11px] tracking-wide">{t('chat.headerSubtitle')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors duration-200"
                            >
                                <X className="w-4 h-4 text-white/40" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            onWheel={(e) => e.stopPropagation()}
                            className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth custom-scrollbar"
                            style={{ overscrollBehavior: 'contain' }}
                        >
                            {messages.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
                                        <Bot className="w-6 h-6 text-white/40" />
                                    </div>
                                    <h3 className="text-white font-semibold text-base mb-1.5 tracking-tight">{t('chat.welcomeTitle')}</h3>
                                    <p className="text-white/35 text-sm mb-8 max-w-[260px] mx-auto leading-relaxed">
                                        {t('chat.welcomeText')}
                                    </p>
                                    <QuickActions onSelect={handleSend} t={t} />
                                </div>
                            )}

                            {messages.map((msg, i) => {
                                if (msg.role === 'action' && msg.type === 'manager') {
                                    return <ManagerButton key={i} phone={phone} label={t('chat.managerBtn')} />;
                                }

                                let textContent = msg.text || '';
                                let serviceTag = null;

                                if (msg.role !== 'user' && textContent) {
                                    const tagMatch = textContent.match(/\[SERVICE:\s*(.+?)\]/);
                                    if (tagMatch) {
                                        textContent = textContent.replace(tagMatch[0], '').trim();
                                    }
                                    serviceTag = detectService(msg.text);
                                }

                                return (
                                    <React.Fragment key={i}>
                                        {textContent && (
                                            <MessageBubble
                                                message={textContent}
                                                isUser={msg.role === 'user'}
                                            />
                                        )}
                                        {serviceTag && onOpenDetails && (
                                            <div className="mb-3">
                                                <ServiceSuggestionCard
                                                    serviceName={serviceTag}
                                                    onOpenDetails={onOpenDetails}
                                                    t={t}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
                                >
                                    <ArrowDown className="w-3.5 h-3.5 text-white/50" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="p-3 border-t border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('chat.inputPlaceholder')}
                                    disabled={isLoading}
                                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/15 transition-all disabled:opacity-50"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black disabled:opacity-20 hover:bg-gray-100 transition-all flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => window.open(`tel:${phone}`, '_self')}
                                className="w-full mt-2.5 py-1 text-center text-white/20 hover:text-white/40 text-[10px] font-medium tracking-wide transition-colors"
                            >
                                {t('chat.humanHint')} {phone}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-4 md:right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] border transition-all duration-300 ${isOpen
                    ? 'bg-white/10 backdrop-blur-md border-white/15'
                    : 'bg-white border-white/20'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <X className="w-5 h-5 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <MessageCircle className="w-5 h-5 text-black" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {!isOpen && (
                <div className="fixed bottom-6 right-4 md:right-6 z-[998] w-14 h-14 rounded-full bg-white/20 animate-ping pointer-events-none" />
            )}
        </>
    );
};
