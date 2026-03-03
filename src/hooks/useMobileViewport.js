import { useEffect } from 'react';

export const useMobileViewport = () => {
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();


        let width = window.innerWidth;
        const handleResize = () => {
            if (window.innerWidth !== width) {
                width = window.innerWidth;
                setVh();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
};
