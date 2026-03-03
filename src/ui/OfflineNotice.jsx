import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineNotice = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="fixed bottom-8 left-0 right-0 z-[10000] flex justify-center pointer-events-none">
            <AnimatePresence>
                {!isOnline && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl"
                    >
                        <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-20"></span>
                            <WifiOff className="w-5 h-5 text-red-400 relative z-10" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">No Internet Connection</p>
                            <p className="text-xs text-white/50">Attempting to reconnect...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
