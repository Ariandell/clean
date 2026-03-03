import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const ScrollReveal = ({ children, delay = 0, className = '', stagger: isStagger = false }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -200px 0px' });
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
                visible: {
                    opacity: 1, y: 0, filter: 'blur(0px)',
                    transition: { delay, staggerChildren: isStagger ? 0.09 : 0, duration: 0.5 }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
