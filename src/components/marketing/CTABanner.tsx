'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center">
      <motion.div 
        className="rounded-2xl bg-accent-purple bg-opacity-10 p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold">Ready to ship smarter?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Start saving resources in less than two minutes and transform how you build.
        </p>
        <Button 
          size="lg" 
          className="mt-8 px-8 py-6 text-lg transition-transform hover:scale-[1.03] hover:shadow-md"
        >
          Get Early Access →
        </Button>
      </motion.div>
    </section>
  );
}
