import React, { useEffect } from 'react';
import Stats from 'stats.js';

export const FPSMonitor = () => {
    useEffect(() => {
        const stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'fixed';
        stats.dom.style.top = '0px';
        stats.dom.style.left = '0px';
        stats.dom.style.zIndex = '100000';
        document.body.appendChild(stats.dom);

        function animate() {
            stats.begin();

            stats.end();
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        return () => {
            document.body.removeChild(stats.dom);
        };
    }, []);

    return null;
};
