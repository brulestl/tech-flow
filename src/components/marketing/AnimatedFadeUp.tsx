'use client';

import { motion } from 'framer-motion';

interface AnimatedFadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedFadeUp({ children, delay = 0 }: AnimatedFadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
