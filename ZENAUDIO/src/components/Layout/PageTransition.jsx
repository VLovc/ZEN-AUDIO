import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { motionVariants } from '../../theme';

const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            variants={motionVariants.pageFade}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
