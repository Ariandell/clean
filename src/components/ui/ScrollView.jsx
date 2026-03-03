import React from "react";
import { motion } from "framer-motion";

export const ScrollView = ({
    children,
    stagger = false,
    delay = 0,
    viewMargin = "0px 0px -100px 0px",
    className = "",
    once = true
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: viewMargin, once }}
            variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                        delay: delay,
                        staggerChildren: stagger ? 0.09 : 0,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
