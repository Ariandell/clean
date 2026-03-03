import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        try {
            return localStorage.getItem('uberem_lang') || 'UA';
        } catch {
            return 'UA';
        }
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    const changeLang = useCallback((newLang) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setLang(newLang);
            try {
                localStorage.setItem('uberem_lang', newLang);
            } catch { }

            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 300);
    }, []);

    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }
        return value !== undefined ? value : key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang: changeLang, t, isTransitioning }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return { lang: 'UA', setLang: () => { }, t: (key) => key, isTransitioning: false };
    }
    return context;
};
